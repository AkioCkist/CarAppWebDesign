import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import FacebookProvider from 'next-auth/providers/facebook'
import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    })
  ],
  
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        if (account.provider === 'google' || account.provider === 'facebook') {
          // Check if user already exists
          const { data: existingUser } = await supabase
            .from('accounts')
            .select('account_id, username, phone_number')
            .eq('email', user.email)
            .single()

          if (existingUser) {
            // User exists, update their info if needed
            const { error: updateError } = await supabase
              .from('accounts')
              .update({
                username: user.name,
                oauth_provider: account.provider,
                oauth_id: account.providerAccountId,
                avatar_url: user.image
              })
              .eq('account_id', existingUser.account_id)

            if (updateError) {
              console.error('Error updating user:', updateError)
            }
            
            // Store user data for session
            user.id = existingUser.account_id
            user.phone = existingUser.phone_number
            
            return true
          } else {
            // Create new user
            const { data: newUser, error: userError } = await supabase
              .from('accounts')
              .insert({
                username: user.name,
                email: user.email,
                oauth_provider: account.provider,
                oauth_id: account.providerAccountId,
                avatar_url: user.image,
                created_at: new Date().toISOString()
              })
              .select('account_id')
              .single()

            if (userError) {
              console.error('Error creating user:', userError)
              return false
            }

            // Assign default role (customer/renter)
            const { error: roleError } = await supabase
              .from('account_roles')
              .insert({
                account_id: newUser.account_id,
                role_id: 2 // Assuming 2 is the customer/renter role ID
              })

            if (roleError) {
              console.error('Role assignment error:', roleError)
            }

            // Store user data for session
            user.id = newUser.account_id
            
            return true
          }
        }
        return true
      } catch (error) {
        console.error('Sign in error:', error)
        return false
      }
    },

    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id
        token.phone = user.phone
        token.provider = account?.provider
      }
      return token
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id
        session.user.phone = token.phone
        session.user.provider = token.provider
        
        // Fetch latest user data including roles
        const { data: userData } = await supabase
          .from('accounts')
          .select(`
            account_id,
            username,
            phone_number,
            email,
            account_roles (
              role_id,
              role:roles (
                role_id,
                role_name
              )
            )
          `)
          .eq('account_id', token.id)
          .single()

        if (userData) {
          session.user.roles = userData.account_roles.map(ar => ({
            id: ar.role.role_id,
            name: ar.role.role_name
          }))
        }
      }
      return session
    }
  },

  pages: {
    signIn: '/signin_registration',
    error: '/signin_registration',
  },

  secret: process.env.NEXTAUTH_SECRET,
})

export { handler as GET, handler as POST }

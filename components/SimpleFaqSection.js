'use client';

import { useState, useEffect } from 'react';

export default function SimpleFaqSection({ faqData }) {
  const [faqContent, setFaqContent] = useState('');

  useEffect(() => {
    // If faqData is provided as prop, use it
    if (faqData) {
      setFaqContent(faqData);
      return;
    }

    // Load the markdown file from public folder
    fetch('/faqs.md')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch FAQ');
        }
        return response.text();
      })
      .then(content => {
        setFaqContent(content);
      })
      .catch(error => {
        console.error('Error loading FAQ:', error);
        setFaqContent('# Error loading FAQ content');
      });
  }, [faqData]);

  // Enhanced markdown parser with level 3 support
  const parseMarkdown = (content) => {
    const lines = content.split('\n');
    const sections = [];
    let currentSection = null;
    let currentContent = [];

    lines.forEach(line => {
      if (line.startsWith('# ')) {
        // Main title
        if (currentSection) {
          currentSection.content = currentContent.join('\n').trim();
          sections.push(currentSection);
        }
        currentSection = {
          type: 'title',
          content: line.replace('# ', ''),
          level: 1
        };
        currentContent = [];
      } else if (line.startsWith('### ')) {
        // Level 3 subsection header
        if (currentSection && currentContent.length > 0) {
          currentSection.content = currentContent.join('\n').trim();
          sections.push(currentSection);
        }
        currentSection = {
          type: 'subsection',
          title: line.replace('### ', ''),
          content: '',
          level: 3
        };
        currentContent = [];
      } else if (line.startsWith('## ')) {
        // Level 2 section header
        if (currentSection && currentContent.length > 0) {
          currentSection.content = currentContent.join('\n').trim();
          sections.push(currentSection);
        }
        currentSection = {
          type: 'section',
          title: line.replace('## ', ''),
          content: '',
          level: 2
        };
        currentContent = [];
      } else {
        // Content line
        currentContent.push(line);
      }
    });

    // Add the last section
    if (currentSection) {
      currentSection.content = currentContent.join('\n').trim();
      sections.push(currentSection);
    }

    return sections;
  };

  const renderContent = (content) => {
    const lines = content.split('\n');
    return lines.map((line, index) => {
      if (line.trim() === '') {
        return <br key={index} />;
      } else if (line.startsWith('- ')) {
        return (
          <div key={index} className="flex items-start mb-2">
            <span className="text-teal-800 mr-3 mt-1 font-bold">•</span>
            <span className="text-gray-700">{line.replace('- ', '')}</span>
          </div>
        );
      } else {
        return (
          <div key={index} className="mb-3 text-gray-700 leading-relaxed">
            {line}
          </div>
        );
      }
    });
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const container = document.getElementById('faq-content-container');
      if (container) {
        const elementTop = element.offsetTop - container.offsetTop - 20;
        container.scrollTo({
          top: elementTop,
          behavior: 'smooth'
        });
      }
    }
  };

  const sections = parseMarkdown(faqContent);
  const titleSection = sections.find(s => s.type === 'title');
  const contentSections = sections.filter(s => s.type === 'section' || s.type === 'subsection');

  if (!faqContent) {
    return (
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-300 rounded w-1/3 mx-auto mb-6"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto mb-3"></div>
          <div className="h-4 bg-gray-300 rounded w-2/3 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header with centered, larger title */}
      <div className="bg-gradient-to-r from-green-400 to-green-600 border-b border-gray-200 px-8 py-6 font-bold text-center">
        {titleSection ? (
          <h1 className="text-7xl font-bold text-gray-800 mb-4">
            {titleSection.content}
          </h1>
        ) : (
          <h1 className="text-7xl font-bold text-gray-800 mb-4">
            Frequently Asked Questions
          </h1>
        )}
        <p className="text-gray-600 text-lg">Frequently Asked Questions</p>
      </div>

      <div className="flex">
        {/* Table of Contents Sidebar with Scroll */}
        <div className="w-80 bg-gray-50 border-r border-gray-200 flex flex-col h-96">
          <div className="p-6 border-b border-gray-200 flex-shrink-0">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-green-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Contents
            </h3>
          </div>
          
          {/* Scrollable navigation area */}
          <div className="flex-1 overflow-y-auto p-6">
            <nav className="space-y-2">
              {contentSections.map((section, index) => (
                <button
                  key={index}
                  onClick={() => scrollToSection(section.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'))}
                  className={`w-full text-left p-3 rounded-lg text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors duration-200 border border-transparent hover:border-blue-200 ${
                    section.type === 'subsection' ? 'ml-4 text-xs bg-gray-100' : ''
                  }`}
                >
                  <span className={`font-medium ${section.type === 'subsection' ? 'text-gray-600' : ''}`}>
                    {section.type === 'subsection' && '└ '}
                    {section.title}
                  </span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1">
          <div 
            id="faq-content-container"
            className="h-96 overflow-y-auto p-8 bg-white"
            style={{
              backgroundImage: `
                linear-gradient(to right, #e5e7eb 1px, transparent 1px),
                linear-gradient(to bottom, #f3f4f6 1px, transparent 1px)
              `,
              backgroundSize: '24px 24px'
            }}
          >
            {/* FAQ Sections */}
            <div className="space-y-10">
              {contentSections.map((section, index) => (
                <div key={index} className="scroll-mt-6">
                  <div 
                    id={section.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}
                    className={`rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow duration-200 ${
                      section.type === 'subsection' 
                        ? 'bg-blue-50 border-blue-200 ml-8' 
                        : 'bg-white border-gray-200'
                    }`}
                  >
                    <h2 className={`font-bold mb-4 flex items-center ${
                      section.type === 'subsection' 
                        ? 'text-xl text-blue-800' 
                        : 'text-2xl text-gray-800'
                    }`}>
                      <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mr-3 ${
                        section.type === 'subsection'
                          ? 'w-6 h-6 bg-blue-200 text-blue-900'
                          : 'bg-emerald-100 text-teal-900'
                      }`}>
                        {section.type === 'subsection' 
                          ? '•' 
                          : contentSections.filter(s => s.type === 'section').findIndex(s => s === section) + 1 || index + 1
                        }
                      </span>
                      {section.title}
                    </h2>
                    <div className={`text-gray-700 leading-relaxed ${
                      section.type === 'subsection' ? 'ml-9' : 'ml-11'
                    }`}>
                      {renderContent(section.content)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Bottom spacing */}
            <div className="h-8"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
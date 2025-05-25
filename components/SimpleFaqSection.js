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

  // Enhanced markdown parser
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
      } else if (line.startsWith('## ')) {
        // Section header
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
          <div key={index} className="flex items-start mb-1">
            <span className="text-gray-400 mr-2 mt-1">•</span>
            <span>{line.replace('- ', '')}</span>
          </div>
        );
      } else {
        return (
          <div key={index} className="mb-2">
            {line}
          </div>
        );
      }
    });
  };

  const sections = parseMarkdown(faqContent);
  const titleSection = sections.find(s => s.type === 'title');
  const contentSections = sections.filter(s => s.type === 'section');

  if (!faqContent) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-300 rounded w-1/4 mx-auto mb-4"></div>
          <div className="h-3 bg-gray-300 rounded w-1/2 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gray-100 border-b border-gray-200 px-6 py-3">
        <div className="flex items-center space-x-2">
          <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6z" clipRule="evenodd" />
          </svg>
          <span className="text-sm font-medium text-gray-700">README.md</span>
        </div>
      </div>

      {/* Content area with scroll */}
      <div className="max-h-96 overflow-y-auto">
        <div className="px-6 py-6">
          {/* Title */}
          {titleSection && (
            <h1 className="text-2xl font-bold text-gray-900 mb-8 pb-2 border-b border-gray-200">
              {titleSection.content}
            </h1>
          )}

          {/* Table of Contents */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Table of Contents</h2>
            <ul className="space-y-1">
              {contentSections.map((section, index) => (
                <li key={index}>
                  <a 
                    href={`#${section.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                    className="text-blue-600 hover:text-blue-800 text-sm hover:underline"
                  >
                    {section.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* FAQ Sections */}
          <div className="space-y-8">
            {contentSections.map((section, index) => (
              <div key={index} className="scroll-mt-4">
                <h2 
                  id={section.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}
                  className="text-xl font-semibold text-gray-900 mb-4 flex items-center group"
                >
                  <a 
                    href={`#${section.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                    className="opacity-0 group-hover:opacity-100 transition-opacity mr-2 text-gray-400 hover:text-blue-600"
                  >
                    #
                  </a>
                  {section.title}
                </h2>
                <div className="text-gray-700 leading-relaxed">
                  {renderContent(section.content)}
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="mt-12 pt-6 border-t border-gray-200">
            <div className="text-sm text-gray-500 text-center">
              <p>Last updated: {new Date().toLocaleDateString()}</p>
              <p className="mt-1">
                <span className="inline-flex items-center space-x-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <span>Need help? Contact our support team</span>
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
'use client';

import { useState, useEffect, useRef } from 'react';

export default function SimpleFaqSection({ faqData }) {
  const [faqContent, setFaqContent] = useState('');
  const [activeSection, setActiveSection] = useState('');
  const containerRef = useRef(null);
  const sectionRefs = useRef({});

  useEffect(() => {
    if (faqData) {
      setFaqContent(faqData);
      return;
    }

    fetch('/faqs.md')
      .then(response => {
        if (!response.ok) throw new Error('Failed to fetch FAQ');
        return response.text();
      })
      .then(content => setFaqContent(content))
      .catch(error => {
        console.error('Error loading FAQ:', error);
        setFaqContent('# Error loading FAQ content');
      });
  }, [faqData]);

  useEffect(() => {
    if (!faqContent) return;

    const observer = new IntersectionObserver(
      (entries) => {
        let maxVisibleRatio = 0;
        let mostVisibleSection = '';

        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > maxVisibleRatio) {
            maxVisibleRatio = entry.intersectionRatio;
            mostVisibleSection = entry.target.id;
          }
        });

        if (mostVisibleSection) {
          setActiveSection(mostVisibleSection);
        }
      },
      {
        root: containerRef.current,
        rootMargin: '-20% 0px -60% 0px',
        threshold: [0, 0.25, 0.5, 0.75, 1]
      }
    );

    // Observe all section elements
    Object.values(sectionRefs.current).forEach(ref => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, [faqContent]);

  const parseMarkdown = (content) => {
    const lines = content.split('\n');
    const sections = [];
    let currentSection = null;
    let currentContent = [];

    lines.forEach(line => {
      if (line.startsWith('# ')) {
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
        currentContent.push(line);
      }
    });

    if (currentSection) {
      currentSection.content = currentContent.join('\n').trim();
      sections.push(currentSection);
    }

    return sections;
  };

  const renderContent = (content) => {
    const lines = content.split('\n');
    return lines.map((line, index) => {
      if (line.trim() === '') return <br key={index} />;
      if (line.startsWith('- ')) {
        return (
          <div key={index} className="flex items-start mb-2">
            <span className="text-teal-800 mr-3 mt-1 font-bold">•</span>
            <span className="text-gray-700">{line.replace('- ', '')}</span>
          </div>
        );
      }
      return (
        <div key={index} className="mb-3 text-gray-700 leading-relaxed">
          {line}
        </div>
      );
    });
  };

  const scrollToSection = (sectionId) => {
    const element = sectionRefs.current[sectionId];
    const container = containerRef.current;
    if (element && container) {
      const elementTop = element.offsetTop - container.offsetTop - 20;
      container.scrollTo({ top: elementTop, behavior: 'smooth' });
      setActiveSection(sectionId);
    }
  };

  const sections = parseMarkdown(faqContent);
  const titleSection = sections.find(s => s.type === 'title');
  const contentSections = sections.filter(s => s.type === 'section' || s.type === 'subsection');

  if (!faqContent) {
    return (
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg border border-gray-200 p-12 text-center">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-300 rounded w-1/3 mx-auto mb-6"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto mb-3"></div>
          <div className="h-4 bg-gray-300 rounded w-2/3 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[98vw] xl:max-w-[1800px] mx-auto bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-green-400 to-green-600 border-b border-gray-200 px-12 py-8 text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-3">
          {titleSection ? titleSection.content : 'Frequently Asked Questions'}
        </h1>
        <p className="text-white text-opacity-80 text-xl">Find answers to common questions</p>
      </div>  

      <div className="flex">
        <div className="w-[28rem] bg-gray-50 border-r border-gray-200 flex flex-col h-[32rem]">
          <div className="p-4 border-b border-gray-200 flex-shrink-0">
            <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center ">
              <svg className="w-6 h-6 mr-2 text-green-800 " fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Contents
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto p-8">
            <nav className="space-y-3">
              {contentSections.map((section, index) => {
                const sectionId = section.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                const isActive = activeSection === sectionId;
                
                return (
                  <button
                    key={index}
                    onClick={() => scrollToSection(sectionId)}
                    className={`relative w-full text-left p-4 rounded-lg text-base transition-all duration-300 border ${
                      section.type === 'subsection' ? 'ml-6 text-sm' : ''
                    } ${
                      isActive
                        ? section.type === 'subsection'
                          ? 'bg-blue-100 text-blue-800 border-blue-300 shadow-sm transform scale-105'
                          : 'bg-green-100 text-green-800 border-green-300 shadow-md transform scale-105'
                        : 'text-gray-700 hover:bg-blue-50 hover:text-blue-700 border-transparent hover:border-blue-200'
                    }`}
                  >
                    {isActive && (
                      <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-r-md ${
                        section.type === 'subsection' ? 'bg-blue-500' : 'bg-green-500'
                      }`}></div>
                    )}
                    <span className={`font-medium transition-all duration-200 ${
                      section.type === 'subsection' 
                        ? isActive ? 'text-blue-800' : 'text-gray-600'
                        : isActive ? 'text-green-800' : ''
                    }`}>
                      {section.type === 'subsection' && '└ '}
                      {section.title}
                    </span>
                    {isActive && (
                      <div className={`absolute -right-1 top-1/2 transform -translate-y-1/2 w-2 h-2 rounded-full ${
                        section.type === 'subsection' ? 'bg-blue-500' : 'bg-green-500'
                      } animate-pulse`}></div>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        <div className="flex-1">
          <div
            ref={containerRef}
            id="faq-content-container"
            className="h-[32rem] overflow-y-auto p-12 bg-white"
            style={{
              backgroundImage: `
                linear-gradient(to right, #e5e7eb 1px, transparent 1px),
                linear-gradient(to bottom, #f3f4f6 1px, transparent 1px)
              `,
              backgroundSize: '28px 28px'
            }}
          >
            <div className="space-y-14">
              {contentSections.map((section, index) => {
                const sectionId = section.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                const isActive = activeSection === sectionId;
                
                return (
                  <div key={index} className="scroll-mt-8">
                    <div
                      ref={el => sectionRefs.current[sectionId] = el}
                      id={sectionId}
                      className={`rounded-lg shadow-sm border p-8 transition-all duration-300 ${
                        section.type === 'subsection'
                          ? 'ml-12'
                          : ''
                      } ${
                        isActive
                          ? section.type === 'subsection'
                            ? 'bg-blue-50 border-blue-300 shadow-lg transform scale-[1.02]'
                            : 'bg-green-50 border-green-300 shadow-lg transform scale-[1.02]'
                          : section.type === 'subsection'
                            ? 'bg-blue-50 border-blue-200 hover:shadow-md'
                            : 'bg-white border-gray-200 hover:shadow-md'
                      }`}
                    >
                      <h2 className={`font-bold mb-6 flex items-center transition-colors duration-300 ${
                        section.type === 'subsection'
                          ? 'text-2xl'
                          : 'text-3xl'
                      } ${
                        isActive
                          ? section.type === 'subsection'
                            ? 'text-blue-900'
                            : 'text-green-900'
                          : section.type === 'subsection'
                            ? 'text-blue-800'
                            : 'text-gray-800'
                      }`}>
                        <span className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold mr-4 transition-all duration-300 ${
                          section.type === 'subsection'
                            ? 'w-8 h-8'
                            : ''
                        } ${
                          isActive
                            ? section.type === 'subsection'
                              ? 'bg-blue-300 text-blue-900 shadow-md'
                              : 'bg-green-200 text-green-900 shadow-md'
                            : section.type === 'subsection'
                              ? 'bg-blue-200 text-blue-900'
                              : 'bg-emerald-100 text-teal-900'
                        }`}>
                          {section.type === 'subsection'
                            ? '•'
                            : contentSections.filter(s => s.type === 'section').findIndex(s => s === section) + 1 || index + 1
                          }
                        </span>
                        {section.title}
                      </h2>
                      <div className={`text-gray-700 leading-relaxed text-lg ${
                        section.type === 'subsection' ? 'ml-12' : 'ml-14'
                      }`}>
                        {renderContent(section.content)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="h-12"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
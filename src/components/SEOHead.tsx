import React, { useEffect } from 'react';

interface SEOHeadProps {
  title: string;
  description: string;
  keywords?: string;
  ogImage?: string;
  canonicalUrl?: string;
  type?: string;
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  keywords,
  ogImage = 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=1200&q=80',
  canonicalUrl,
  type = 'website',
}) => {
  useEffect(() => {
    const defaultTitle = document.title;
    document.title = title;

    const setMeta = (nameAttr: string, nameVal: string, content: string) => {
      let tag = document.querySelector(`meta[${nameAttr}="${nameVal}"]`) as HTMLMetaElement;
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute(nameAttr, nameVal);
        tag.setAttribute('data-dynamic-seo', 'true');
        document.head.appendChild(tag);
      }
      tag.content = content;
      return tag;
    };

    const tags: HTMLMetaElement[] = [];

    tags.push(setMeta('name', 'description', description));
    
    if (keywords) {
      tags.push(setMeta('name', 'keywords', keywords));
    } else {
      tags.push(setMeta('name', 'keywords', 'Cyber Cafe Services, Online Forms, Document Printing, Sarkari Yojana, PVC Aadhaar, Shahnawaz Computer Center'));
    }

    tags.push(setMeta('property', 'og:title', title));
    tags.push(setMeta('property', 'og:description', description));
    tags.push(setMeta('property', 'og:image', ogImage));
    tags.push(setMeta('property', 'og:type', type));
    if (canonicalUrl) {
      tags.push(setMeta('property', 'og:url', canonicalUrl));
      
      let canonicalLink = document.querySelector(`link[rel="canonical"]`) as HTMLLinkElement;
      if (!canonicalLink) {
        canonicalLink = document.createElement('link');
        canonicalLink.setAttribute('rel', 'canonical');
        canonicalLink.setAttribute('data-dynamic-seo', 'true');
        document.head.appendChild(canonicalLink);
      }
      canonicalLink.href = canonicalUrl;
    }

    // Twitter tags
    tags.push(setMeta('name', 'twitter:card', 'summary_large_image'));
    tags.push(setMeta('name', 'twitter:title', title));
    tags.push(setMeta('name', 'twitter:description', description));
    tags.push(setMeta('name', 'twitter:image', ogImage));

    return () => {
      // We don't necessarily want to remove all tags on unmount because the next page will overwrite them.
      // But for a true reset, we should clean up data-dynamic-seo tags if we want to fallback to index.html defaults.
      // However, it's safer to just let the next page mount its own SEOHead.
    };
  }, [title, description, keywords, ogImage, canonicalUrl, type]);

  return null;
};

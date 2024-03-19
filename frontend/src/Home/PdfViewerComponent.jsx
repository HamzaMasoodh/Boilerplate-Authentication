import React, { useEffect, useRef } from 'react';

const PdfViewerComponent = ({ fileUrl }) => {
  const viewerRef = useRef(null);

  useEffect(() => {
    const iframe = document.createElement('iframe');

    // Point to the viewer.html from PDF.js, adjust the path as needed
    iframe.src = `/web/viewer.html?file=${encodeURIComponent(fileUrl)}`;
    iframe.width = '100%';
    iframe.height = '100vh';

    viewerRef.current.appendChild(iframe);
  }, [fileUrl]);

  return <div ref={viewerRef} style={{ width: '100%', height: '100vh' }} />;
};

export default PdfViewerComponent;

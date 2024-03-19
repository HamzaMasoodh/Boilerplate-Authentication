import React, { useState } from 'react';
import PdfViewerComponent from './PdfViewerComponent';

const App = () => {
  const [fileUrl, setFileUrl] = useState("https://example.com/your-pdf-file.pdf");

  return (
    <div>
      <PdfViewerComponent fileUrl={fileUrl} />
    </div>
  );
};

export default App;

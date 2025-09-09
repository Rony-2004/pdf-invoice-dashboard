import { pdfjs } from 'react-pdf';

// Configure PDF.js worker for production
if (typeof window !== 'undefined') {
  // Use CDN for production, local for development
  const workerSrc = process.env.NODE_ENV === 'production' 
    ? `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`
    : '/pdf.worker.min.js';
    
  pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;
  console.log('PDF Worker configured:', workerSrc);
}

export { pdfjs };

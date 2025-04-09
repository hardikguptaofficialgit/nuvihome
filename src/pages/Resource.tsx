import React, { useState } from 'react';
import { useResources } from '@/contexts/ResourceContext';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Download, Link2, Share2, Folder, User, Calendar, X, Eye, ZoomIn, ZoomOut, RotateCw, ChevronLeft, ChevronRight, Maximize, Printer, Lock } from 'lucide-react';

const Resource = () => {
  const { resources } = useResources();
  const [previewUrl, setPreviewUrl] = useState('');
  const [previewZoom, setPreviewZoom] = useState(1);
  const [previewPage, setPreviewPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handleCopyLink = (url) => {
    navigator.clipboard.writeText(url);
    alert('Link copied to clipboard!');
  };

  const handleZoomIn = () => {
    setPreviewZoom(Math.min(previewZoom + 0.25, 2.5));
  };

  const handleZoomOut = () => {
    setPreviewZoom(Math.max(previewZoom - 0.25, 0.5));
  };

  const handleResetZoom = () => {
    setPreviewZoom(1);
  };

  const handleNextPage = () => {
    if (previewPage < totalPages) {
      setPreviewPage(previewPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (previewPage > 1) {
      setPreviewPage(previewPage - 1);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.querySelector('.pdf-preview-container')?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handlePrint = () => {
    const printWindow = window.open(previewUrl, '_blank');
    printWindow.onload = () => {
      printWindow.print();
    };
  };

  const openPreview = (url) => {
    setPreviewUrl(url);
    setPreviewZoom(1);
    setPreviewPage(1);
    setIsPreviewOpen(true);
    // In a real implementation, we would fetch the total pages from the PDF here
    setTotalPages(10); // Placeholder
  };

  return (
    <div className="pt-24 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-1.5 rounded-full mb-4">
            <Folder size={16} />
            <span className="font-medium">Resources</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold">
            Download & Share <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent to-accent/70">Resources</span>
          </h1>
          <p className="mt-5 text-lg text-muted-foreground max-w-2xl mx-auto">
            Access useful study materials, guides, and documents to support your exam preparation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {resources.map((res, index) => (
            <Card 
              key={res.id}
              className="overflow-hidden animate-fade-in hover:shadow-xl hover:scale-[1.01] transition-all duration-300 group rounded-2xl"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="h-48 bg-gradient-to-br from-accent/5 to-secondary/30 flex items-center justify-center relative">
                <img
                  src="https://res.cloudinary.com/ddx6avza4/image/upload/v1744129312/n_rz5riq.png"
                  alt="Logo"
                  className="w-20 h-20 object-contain"
                />
              </div>

              <CardContent className="p-6">
                <div className="flex flex-wrap gap-2 mb-3">
                  {res.tags.slice(0, 3).map((tag, i) => (
                    <Badge key={i} variant="outline" className="bg-accent/10 text-black dark:text-accent border-accent/30">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <h2 className="text-xl font-semibold mb-2 text-black dark:text-white transition-none line-clamp-2">
                  {res.title}
                </h2>
                <p className="text-muted-foreground text-sm line-clamp-3 mb-4">{res.description}</p>

                <div className="flex items-center text-sm text-muted-foreground mb-2 gap-4">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    <span>{res.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <User className="h-4 w-4" />
                    <span>{res.uploader}</span>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="px-6 py-4 bg-secondary/10 border-t border-border flex flex-col gap-2">
                <div className="grid grid-cols-2 gap-2 w-full">
                  <Button 
                    className="w-full bg-accent text-black dark:text-black hover:bg-accent/90 flex items-center gap-2"
                    onClick={() => window.open(res.downloadUrl, '_blank')}
                  >
                    <Download size={16} />
                    Download
                  </Button>

                  <Button 
                    variant="outline"
                    className="border-black text-black hover:bg-accent hover:text-black dark:border-accent dark:text-accent dark:hover:text-black flex items-center gap-2"
                    onClick={() => handleCopyLink(res.downloadUrl)}
                  >
                    <Link2 size={16} />
                    Copy Link
                  </Button>
                </div>

                <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      className="text-sm text-black dark:text-white dark:hover:text-black hover:underline mt-2 flex items-center gap-2"
                      onClick={() => openPreview(res.downloadUrl)}
                    >
                      <Eye size={16} />
                      Preview Notes
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="w-full max-w-6xl h-[90vh] p-0 overflow-hidden bg-white dark:bg-gray-900">
                    <div className="h-full flex flex-col">
                      {/* PDF Toolbar */}
                      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-gray-50 dark:bg-gray-800">
                        <div className="flex items-center gap-2">
                          <DialogTitle className="m-0 text-lg font-medium truncate max-w-md">
                            {resources.find(r => r.downloadUrl === previewUrl)?.title || "Document Preview"}
                          </DialogTitle>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" onClick={handlePrevPage} disabled={previewPage <= 1} className="text-black dark:text-white">
                            <ChevronLeft size={16} />
                          </Button>
                          <span className="text-sm text-black dark:text-white">
                            Page {previewPage} of {totalPages}
                          </span>
                          <Button variant="ghost" size="sm" onClick={handleNextPage} disabled={previewPage >= totalPages} className="text-black dark:text-white">
                            <ChevronRight size={16} />
                          </Button>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" onClick={handleZoomOut} className="text-black dark:text-white">
                            <ZoomOut size={16} />
                          </Button>
                          <span className="text-sm text-black dark:text-white">{Math.round(previewZoom * 100)}%</span>
                          <Button variant="ghost" size="sm" onClick={handleZoomIn} className="text-black dark:text-white">
                            <ZoomIn size={16} />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={handleResetZoom} className="text-black dark:text-white">
                            <RotateCw size={16} />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={toggleFullscreen} className="text-black dark:text-white">
                            <Maximize size={16} />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={handlePrint} className="text-black dark:text-white">
                            <Printer size={16} />
                          </Button>
                          <DialogClose >
                           
                          </DialogClose>
                          <DialogClose >
                           
                          </DialogClose>
                          <DialogClose >
                           
                          </DialogClose>
                        </div>

                      </div>
                      
                      {/* PDF Viewer */}
                      <div className="flex-1 overflow-auto bg-gray-100 dark:bg-gray-800 pdf-preview-container">
                        <div 
                          className="w-full h-full flex items-center justify-center"
                          style={{ transform: `scale(${previewZoom})`, transition: 'transform 0.2s ease' }}
                        >
                          <iframe 
                            src={previewUrl} 
                            className="w-full h-full border-none"
                            title="Preview PDF"
                          ></iframe>
                        </div>
                      </div>
                      
                      {/* PDF Footer */}
                      <div className="flex items-center justify-between px-4 py-2 border-t border-border bg-gray-50 dark:bg-gray-800">
                        <div className="flex items-center gap-2">
                          <Button 
                            className="bg-accent text-black dark:text-black hover:bg-accent/90 flex items-center gap-2"
                            onClick={() => window.open(previewUrl, '_blank')}
                          >
                            <Download size={16} />
                            Download PDF
                          </Button>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Lock size={14} /> 
                          <span>Nuvi+ Security</span>
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>

                <div className="flex justify-center gap-3 text-muted-foreground text-sm mt-2">
                <div className="flex justify-center gap-3 text-sm mt-2">
  
  {/* WhatsApp */}
  <a
    href={`https://wa.me/?text=${encodeURIComponent(res.downloadUrl)}`}
    target="_blank"
    rel="noreferrer"
  >
   <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="40" height="40" viewBox="0 0 50 50" className="fill-current">
    <path d="M 25 2 C 12.3 2 2 12.3 2 25 C 2 29.1 3.1 32.899219 5 36.199219 L 2 46.699219 C 1.9 46.999219 1.9992187 47.399219 2.1992188 47.699219 C 2.4992187 47.999219 2.8992187 48 3.1992188 48 L 14.199219 45.300781 C 17.399219 47.000781 21.1 48 25 48 C 37.7 48 48 37.7 48 25 C 48 12.3 37.7 2 25 2 z M 25 4 C 36.6 4 46 13.4 46 25 C 46 36.6 36.6 46 25 46 C 21.3 46 17.800781 45.000781 14.800781 43.300781 C 14.600781 43.200781 14.299609 43.099219 14.099609 43.199219 L 4.5 45.599609 L 7 36.400391 C 7.1 36.100391 7.0003906 35.899609 6.9003906 35.599609 C 5.1003906 32.499609 4 28.9 4 25 C 4 13.4 13.4 4 25 4 z M 18.113281 12.988281 C 17.925781 12.975781 17.800781 13 17.800781 13 L 16.599609 13 C 15.999609 13 15.100781 13.2 14.300781 14 C 13.800781 14.5 12 16.3 12 19.5 C 12 22.9 14.299609 25.799609 14.599609 26.099609 C 14.599609 26.099609 15 26.600781 15.5 27.300781 C 16 28.000781 16.699609 28.800781 17.599609 29.800781 C 19.399609 31.700781 21.899609 33.899219 25.099609 35.199219 C 26.499609 35.799219 27.699609 36.2 28.599609 36.5 C 30.199609 37 31.700781 36.900781 32.800781 36.800781 C 33.600781 36.700781 34.500391 36.299219 35.400391 35.699219 C 36.300391 35.099219 37.199609 34.400391 37.599609 33.400391 C 37.899609 32.600391 37.999609 31.900781 38.099609 31.300781 L 38.099609 30.5 C 38.099609 30.2 38.000781 30.200781 37.800781 29.800781 C 37.300781 29.000781 36.799219 29.000781 36.199219 28.800781 C 35.899219 28.600781 34.999219 28.200781 34.199219 27.800781 C 33.299219 27.400781 32.599609 27.000781 32.099609 26.800781 C 31.799609 26.700781 31.400391 26.499609 30.900391 26.599609 C 30.400391 26.699609 29.899609 27 29.599609 27.5 C 29.299609 27.9 28.200781 29.299219 27.800781 29.699219 L 27.699219 29.599609 C 27.299219 29.399609 26.7 29.200781 26 28.800781 C 25.2 28.400781 24.299219 27.800781 23.199219 26.800781 C 21.599219 25.400781 20.499219 23.699609 20.199219 23.099609 C 20.499219 22.699609 20.899609 22.3 21.099609 22 C 21.199609 21.9 21.280859 21.799219 21.349609 21.699219 C 21.418359 21.599219 21.475391 21.500391 21.525391 21.400391 C 21.625391 21.200391 21.700781 21.000781 21.800781 20.800781 C 22.200781 20.100781 22.000781 19.300391 21.800781 18.900391 C 21.800781 18.900391 21.7 18.600781 21.5 18.300781 C 21.4 18.000781 21.2 17.499609 21 17.099609 C 20.6 16.199609 20.2 15.199609 20 14.599609 C 19.7 13.899609 19.300781 13.399219 18.800781 13.199219 C 18.550781 13.049219 18.300781 13.000781 18.113281 12.988281 z M 16.599609 15 L 17.699219 15 L 17.900391 15 C 17.900391 15 17.999609 15.100391 18.099609 15.400391 C 18.299609 16.000391 18.799609 17.000391 19.099609 17.900391 C 19.299609 18.300391 19.499609 18.799609 19.599609 19.099609 C 19.699609 19.399609 19.800391 19.600781 19.900391 19.800781 C 19.900391 19.900781 20 19.900391 20 19.900391 C 19.8 20.300391 19.8 20.399219 19.5 20.699219 C 19.2 21.099219 18.799219 21.499219 18.699219 21.699219 C 18.599219 21.899219 18.299609 22.1 18.099609 22.5 C 17.899609 22.9 18.000781 23.599609 18.300781 24.099609 C 18.700781 24.699609 19.900781 26.700391 21.800781 28.400391 C 23.000781 29.500391 24.1 30.199609 25 30.599609 C 25.9 31.099609 26.600781 31.300391 26.800781 31.400391 C 27.200781 31.600391 27.599609 31.699219 28.099609 31.699219 C 28.599609 31.699219 29.000781 31.3 29.300781 31 C 29.700781 30.6 30.699219 29.399609 31.199219 28.599609 L 31.400391 28.699219 C 31.400391 28.699219 31.699609 28.8 32.099609 29 C 32.499609 29.2 32.900391 29.399609 33.400391 29.599609 C 34.300391 29.999609 35.100391 30.399609 35.400391 30.599609 L 36 30.900391 L 36 31.199219 C 36 31.599219 35.899219 32.200781 35.699219 32.800781 C 35.599219 33.100781 35.000391 33.699609 34.400391 34.099609 C 33.700391 34.499609 32.899609 34.800391 32.599609 34.900391 C 31.699609 35.000391 30.600781 35.099219 29.300781 34.699219 C 28.500781 34.399219 27.4 34.1 26 33.5 C 23.2 32.3 20.899219 30.3 19.199219 28.5 C 18.399219 27.6 17.699219 26.799219 17.199219 26.199219 C 16.699219 25.599219 16.500781 25.2 16.300781 25 C 15.900781 24.6 14 21.999609 14 19.599609 C 14 17.099609 15.200781 16.100391 15.800781 15.400391 C 16.100781 15.000391 16.499609 15 16.599609 15 z"></path>
   </svg>
  </a>

  {/* Telegram */}
  <a
    href={`https://t.me/share/url?url=${encodeURIComponent(res.downloadUrl)}`}
    target="_blank"
    rel="noreferrer"
  >
    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="40" height="40" viewBox="0 0 50 50" className="fill-current">
      <path d="M 25 2 C 12.309288 2 2 12.309297 2 25 C 2 37.690703 12.309288 48 25 48 C 37.690712 48 48 37.690703 48 25 C 48 12.309297 37.690712 2 25 2 z M 25 4 C 36.609833 4 46 13.390175 46 25 C 46 36.609825 36.609833 46 25 46 C 13.390167 46 4 36.609825 4 25 C 4 13.390175 13.390167 4 25 4 z M 34.087891 14.035156 C 33.403891 14.035156 32.635328 14.193578 31.736328 14.517578 C 30.340328 15.020578 13.920734 21.992156 12.052734 22.785156 C 10.984734 23.239156 8.9960938 24.083656 8.9960938 26.097656 C 8.9960938 27.432656 9.7783594 28.3875 11.318359 28.9375 C 12.146359 29.2325 14.112906 29.828578 15.253906 30.142578 C 15.737906 30.275578 16.25225 30.34375 16.78125 30.34375 C 17.81625 30.34375 18.857828 30.085859 19.673828 29.630859 C 19.666828 29.798859 19.671406 29.968672 19.691406 30.138672 C 19.814406 31.188672 20.461875 32.17625 21.421875 32.78125 C 22.049875 33.17725 27.179312 36.614156 27.945312 37.160156 C 29.021313 37.929156 30.210813 38.335938 31.382812 38.335938 C 33.622813 38.335938 34.374328 36.023109 34.736328 34.912109 C 35.261328 33.299109 37.227219 20.182141 37.449219 17.869141 C 37.600219 16.284141 36.939641 14.978953 35.681641 14.376953 C 35.210641 14.149953 34.672891 14.035156 34.087891 14.035156 z M 34.087891 16.035156 C 34.362891 16.035156 34.608406 16.080641 34.816406 16.181641 C 35.289406 16.408641 35.530031 16.914688 35.457031 17.679688 C 35.215031 20.202687 33.253938 33.008969 32.835938 34.292969 C 32.477938 35.390969 32.100813 36.335938 31.382812 36.335938 C 30.664813 36.335938 29.880422 36.08425 29.107422 35.53125 C 28.334422 34.97925 23.201281 31.536891 22.488281 31.087891 C 21.863281 30.693891 21.201813 29.711719 22.132812 28.761719 C 22.899812 27.979719 28.717844 22.332938 29.214844 21.835938 C 29.584844 21.464938 29.411828 21.017578 29.048828 21.017578 C 28.923828 21.017578 28.774141 21.070266 28.619141 21.197266 C 28.011141 21.694266 19.534781 27.366266 18.800781 27.822266 C 18.314781 28.124266 17.56225 28.341797 16.78125 28.341797 C 16.44825 28.341797 16.111109 28.301891 15.787109 28.212891 C 14.659109 27.901891 12.750187 27.322734 11.992188 27.052734 C 11.263188 26.792734 10.998047 26.543656 10.998047 26.097656 C 10.998047 25.463656 11.892938 25.026 12.835938 24.625 C 13.831938 24.202 31.066062 16.883437 32.414062 16.398438 C 33.038062 16.172438 33.608891 16.035156 34.087891 16.035156 z"></path>
    </svg>
  </a>
</div>


                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Resource;

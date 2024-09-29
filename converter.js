document.getElementById('fileInput').addEventListener('change', handleFileSelect);

async function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file.type !== 'application/pdf') {
        alert('Please select a PDF file.');
        return;
    }

    const fileReader = new FileReader();
    fileReader.onload = async function() {
        const pdfData = new Uint8Array(this.result);
        const pdf = await pdfjsLib.getDocument({data: pdfData}).promise;
        const canvas = document.getElementById('pdfCanvas');
        const context = canvas.getContext('2d');
        const progressBar = document.getElementById('progressBar');

        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const viewport = page.getViewport({scale: 2.0}); // Adjust scale to control resolution
            canvas.width = viewport.width;
            canvas.height = viewport.height;

            const renderContext = {
                canvasContext: context,
                viewport: viewport
            };

            await page.render(renderContext).promise;

            // Convert canvas to PNG and trigger download
            canvas.toBlob(blob => {
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = `page-${pageNum}.png`;
                link.click();
            });

            // Update the progress bar
            const progress = (pageNum / pdf.numPages) * 100;
            progressBar.style.width = `${progress}%`;
            progressBar.textContent = `${Math.round(progress)}%`;
        }
    };

    fileReader.readAsArrayBuffer(file);
}

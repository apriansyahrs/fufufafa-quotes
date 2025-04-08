document.addEventListener('DOMContentLoaded', () => {
    // Elemen-elemen DOM
    const quoteContent = document.getElementById('quote-content');
    const quoteImage = document.getElementById('quote-image');
    const quoteDate = document.getElementById('quote-date');
    const quoteSource = document.getElementById('quote-source');
    const newQuoteBtn = document.getElementById('new-quote-btn');
    const loadingSpinner = document.getElementById('loading-spinner');
    const downloadImageBtn = document.getElementById('download-image-btn');
    
    // URL endpoint untuk quotes
    const apiUrl = 'https://fufufafapi.vanirvan.my.id/api?fbclid=IwY2xjawJhgFVleHRuA2FlbQIxMAABHq1ilMYdI38qeZlZJwbm1MEH9fmPCKcB073s1SuV3ebiA9QHwudcfJuuNTMY_aem_QEchyvC-2Q8ROwRfESPxIA';
    
    // Array untuk menyimpan quotes
    let quotes = [];
    
    // Fungsi untuk mengambil data dari API
    async function fetchQuotes() {
        showLoading();
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error('Gagal mengambil data dari API');
            }
            quotes = await response.json();
            displayRandomQuote();
        } catch (error) {
            console.error('Error:', error);
            quoteContent.textContent = 'Terjadi kesalahan saat mengambil quotes. Silakan coba lagi nanti.';
            hideLoading();
        }
    }
    
    // Fungsi untuk menampilkan quote secara acak
    function displayRandomQuote() {
        if (quotes.length === 0) {
            quoteContent.textContent = 'Tidak ada quotes yang tersedia.';
            hideLoading();
            return;
        }
        
        // Simulasi delay untuk menampilkan loading (opsional, bisa dihapus)
        setTimeout(() => {
            // Pilih quote secara acak
            const randomIndex = Math.floor(Math.random() * quotes.length);
            const quote = quotes[randomIndex];
            
            // Tampilkan konten quote
            quoteContent.textContent = quote.content;
            
            // Tampilkan gambar jika tersedia
            if (quote.image_url) {
                quoteImage.src = quote.image_url;
                quoteImage.style.display = 'block';
                downloadImageBtn.disabled = false; // Enable download button
            } else {
                quoteImage.style.display = 'none';
                downloadImageBtn.disabled = true; // Disable download button
            }
            
            // Format tanggal
            const date = new Date(parseInt(quote.datetime));
            const formattedDate = date.toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
            quoteDate.textContent = formattedDate;
            
            // Set link sumber
            if (quote.doksli) {
                quoteSource.href = quote.doksli;
                quoteSource.style.display = 'inline';
            } else {
                quoteSource.style.display = 'none';
            }
            
            // Sembunyikan loading spinner setelah quote ditampilkan
            hideLoading();
        }, 500); // Delay 500ms untuk efek loading (bisa disesuaikan)
    }
    
    // Fungsi untuk menampilkan loading spinner
    function showLoading() {
        loadingSpinner.style.display = 'flex';
        // No need to change opacity of quote container since the spinner is inside it
        // with a semi-transparent background
    }
    
    // Fungsi untuk menyembunyikan loading spinner
    function hideLoading() {
        loadingSpinner.style.display = 'none';
        // No need to reset opacity since we're not changing it anymore
    }
    
    // Fungsi untuk mengunduh gambar
    async function downloadImage() {
        if (quoteImage.src) {
            try {
                // Menampilkan loading saat mengunduh
                downloadImageBtn.textContent = 'Mengunduh...';
                downloadImageBtn.disabled = true;
                
                // Mengambil gambar
                const response = await fetch(quoteImage.src);
                const blob = await response.blob();
                
                // Membuat URL untuk blob
                const blobUrl = window.URL.createObjectURL(blob);
                
                // Membuat elemen anchor untuk download
                const a = document.createElement('a');
                
                // Mendapatkan nama file dari URL
                const filename = quoteImage.src.substring(quoteImage.src.lastIndexOf('/') + 1);
                
                // Set properti anchor
                a.href = blobUrl;
                a.download = filename || 'fufufafa-quote-image.jpg';
                a.style.display = 'none';
                
                // Tambahkan ke DOM, klik, dan hapus
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(blobUrl);
                document.body.removeChild(a);
                
                // Kembalikan tombol ke keadaan semula
                downloadImageBtn.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                        <path d="M8 4a.5.5 0 0 1 .5.5v5.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 1 1 .708-.708L7.5 10.293V4.5A.5.5 0 0 1 8 4z"/>
                    </svg>
                    Unduh
                `;
                downloadImageBtn.disabled = false;
                
            } catch (error) {
                console.error('Error downloading image:', error);
                alert('Gagal mengunduh gambar. Silakan coba lagi nanti.');
                
                downloadImageBtn.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                        <path d="M8 4a.5.5 0 0 1 .5.5v5.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 1 1 .708-.708L7.5 10.293V4.5A.5.5 0 0 1 8 4z"/>
                    </svg>
                    Unduh
                `;
                downloadImageBtn.disabled = false;
            }
        }
    }
    
    // Add this function to safely handle accessing CSS rules
    function safelyAccessStylesheet() {
        try {
            const styleSheets = Array.from(document.styleSheets);
            for (const sheet of styleSheets) {
                // Only access same-origin stylesheets
                if (sheet.href === null || sheet.href.startsWith(window.location.origin)) {
                    // Try to access rules safely
                    try {
                        const rules = sheet.cssRules;
                        console.log("Successfully accessed CSS rules");
                        return true;
                    } catch (e) {
                        console.warn("Couldn't access cssRules for stylesheet:", sheet.href);
                    }
                }
            }
            console.warn("Couldn't access any stylesheet rules due to CORS restrictions");
            return false;
        } catch (error) {
            console.error("Error accessing stylesheets:", error);
            return false;
        }
    }
    
    // Call this function when the page loads
    document.addEventListener('DOMContentLoaded', function() {
        // Check if we can access the stylesheets
        safelyAccessStylesheet();
        
        // ...rest of your initialization code...
    });
    
    // Event listener untuk tombol quote baru
    newQuoteBtn.addEventListener('click', () => {
        showLoading();
        displayRandomQuote();
    });
    
    // Event listener untuk tombol download
    downloadImageBtn.addEventListener('click', downloadImage);
    
    // Ambil quotes saat halaman dimuat
    fetchQuotes();
});
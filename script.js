// Função que inicia o scanner e configura o comportamento
function iniciarScanner() {
    // Instancia o scanner para leitura de QR Code
    const scanner = new Html5QrcodeScanner('reader', {
        qrbox: {
            width: 250,  // Tamanho do quadrado para a leitura do QR Code
            height: 250
        },
        fps: 20,  // Frames por segundo para tentar capturar o QR Code
    });

    // Inicia o scanner com as funções de sucesso e erro
    scanner.render(onSucesso, onErro);
}

// Função chamada quando o QR Code é lido com sucesso
function onSucesso(resultado) {
    // Exibe o resultado do QR Code lido
    const resultadoElement = document.getElementById('output');
    resultadoElement.innerHTML = `
        <h2>QR Code Lido com Sucesso!</h2>
        <p><a href="${resultado}" target="_blank">${resultado}</a></p>
    `;
    
    // Parar o scanner após o sucesso
    // Não é necessário chamar `clear()`, pois o scanner para automaticamente após a leitura.
    // Em vez disso, se quiser encerrar o scanner e removê-lo do DOM, pode fazer assim:
    const readerElement = document.getElementById('reader');
    if (readerElement) {
        readerElement.innerHTML = '';  // Limpa o elemento do leitor
    }
}

// Função chamada em caso de erro ao tentar ler o QR Code
function onErro(err) {
    console.error('Erro ao ler QR Code:', err);
    // Exibe uma mensagem de erro mais detalhada
    const resultadoElement = document.getElementById('output');
    resultadoElement.innerHTML = `
        <h2>Erro ao tentar ler QR Code</h2>
        <p>Não conseguimos detectar o QR Code. Tente novamente ou use uma imagem mais nítida.</p>
    `;
}

// Função que permite a leitura de um arquivo de imagem
function lerImagem(event) {
    const file = event.target.files[0];
    if (file) {
        // Lê a imagem com a biblioteca jsQR para verificar o QR Code
        const reader = new FileReader();
        reader.onload = function(e) {
            const imageData = e.target.result;
            const img = new Image();
            img.src = imageData;

            img.onload = function() {
                // Verifica se a imagem foi carregada corretamente
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);

                // Usa jsQR para decodificar o QR Code da imagem
                const imageDataForQR = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const qrCode = jsQR(imageDataForQR.data, canvas.width, canvas.height);

                if (qrCode) {
                    // Exibe o resultado quando o QR Code é encontrado
                    document.getElementById('output').innerHTML = `
                        <h2>QR Code Lido com Sucesso!</h2>
                        <p><a href="${qrCode.data}" target="_blank">${qrCode.data}</a></p>
                    `;
                } else {
                    // Exibe uma mensagem caso o QR Code não seja encontrado
                    document.getElementById('output').innerHTML = `
                        <h2>QR Code não encontrado na imagem</h2>
                        <p>Verifique a qualidade da imagem ou tente outra imagem.</p>
                    `;
                }
            };
            
            img.onerror = function() {
                // Exibe erro caso a imagem não seja carregada corretamente
                document.getElementById('output').innerHTML = `
                    <h2>Erro ao carregar a imagem</h2>
                    <p>Certifique-se de que a imagem está em um formato suportado.</p>
                `;
            };
        };
        reader.readAsDataURL(file);
    }
}

// Inicia o scanner quando a página é carregada
window.onload = function() {
    iniciarScanner();
    
    // Configura o evento para carregar a imagem
    document.getElementById('fileInput').addEventListener('change', lerImagem);
};
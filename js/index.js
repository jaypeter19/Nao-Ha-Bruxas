// Set variables
const cloudName = 'djbpyhruu'; //CloudName
const unsignedPreset = "nao_ha_bruxas"; //Folder
const tags = "espetaculo"; //Tags utilized

// Upload buttons
const btnUploadImg = document.getElementById("btnImgUpload");

//Files inputs for images and videos
const inputImg = document.getElementById("imgs");

//Modal Preview Selectors
const previewContainer = document.getElementById("previewContainer");
const enviarBtn = document.getElementById("btnEnviar");
const excluirBtn = document.getElementById('btnExcluir');

// Spinner selector
const spinner = document.getElementById('loadingSpinner');


let arquivosSelecionados = [];

function handleFiles(files, type) {
    arquivosSelecionados = [...files];

    if (type === 'image') {
        arquivosSelecionados.forEach(file => {
            const reader = new FileReader();
            reader.onload = e => {
                const element = document.createElement('img');
                element.src = e.target.result;
                element.classList.add("img-thumbnail");
                element.style.maxWidth = "200px";
                element.style.objectFit = "cover";
                previewContainer.appendChild(element);
            };
            reader.readAsDataURL(file);
        });

        const modal = new bootstrap.Modal(document.getElementById("previewModal"));
        modal.show();
    }
};


async function uploadFiles(files) {
    if (!files.length) return;

    spinner.style.display = 'block';


    try {

        const modalEl = document.getElementById("previewModal");
        const modal = bootstrap.Modal.getInstance(modalEl);
        if (modal) modal.hide();


        for (let file of files) {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", unsignedPreset);
            formData.append("tags", tags);

            await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
                method: "POST",
                body: formData
            });
            console.log('Upload feito!');
        }

        // Reset
        arquivosSelecionados = [];
        previewContainer.innerHTML = "";
        inputImg.value = "";

        // Toast de sucesso
        const toastSuccess = document.getElementById("successToast");
        bootstrap.Toast.getOrCreateInstance(toastSuccess).show();

    } catch (error) {
        console.error(error);

        // Reset
        arquivosSelecionados = [];
        previewContainer.innerHTML = "";
        inputImg.value = "";

        // Fecha modal se aberto
        const modalEl = document.getElementById("previewModal");
        const modal = bootstrap.Modal.getInstance(modalEl);
        if (modal) modal.hide();

        // Toast de erro
        const toastError = document.getElementById("errorToast");
        bootstrap.Toast.getOrCreateInstance(toastError).show();
    } finally {
        spinner.style.display = 'none';
    }
}

// Fire event for files inputs
btnUploadImg.addEventListener("click", () => inputImg.click());

//Event Listener for input files imgs and videos
inputImg.addEventListener("change", () => handleFiles(inputImg.files, "image"));

// Upload for Cloudinary
enviarBtn.addEventListener("click", async () => uploadFiles(arquivosSelecionados));

// Delete files selected
excluirBtn.addEventListener('click', () => {

    //Reset variable & Preview modal
    arquivosSelecionados = [];
    previewContainer.innerHTML = "";

    //Reset inputs
    inputImg.value = "";
    const modalEl = document.getElementById("previewModal");
    const modal = bootstrap.Modal.getInstance(modalEl);
    if (modal) modal.hide();
})

async function getVetClinics() {
    const proxy = "https://corsproxy.io/?"; // Declare proxy first
    const apiKey = "AIzaSyDxWR63g1EId-5c3GZAJ2LXRJBgOHa3BWo"; // Replace with your key
    const location = "40.712776,-74.005974"; // NYC coordinates
    const radius = 5000;
    const type = "veterinary_care";

    const apiUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location}&radius=${radius}&type=${type}&key=${apiKey}`;
    const url = proxy + encodeURIComponent(apiUrl); // Bypass CORS restrictions

    try {
        console.log("Fetching:", url);
        const response = await fetch(url);
        const data = await response.json();
        console.log("API Response:", data);

        if (data.status === "OK") {
            displayVetClinics(data.results.slice(0, 5));
        } else {
            console.error("Google API Error:", data.status, data.error_message);
            document.getElementById("vet-list").innerHTML = `<p>Error: ${data.status} - ${data.error_message}</p>`;
        }
    } catch (error) {
        console.error("Fetch Error:", error);
        document.getElementById("vet-list").innerHTML = `<p>Failed to retrieve data. See console logs.</p>`;
    }
}


function displayVetClinics(vets) {
    const container = document.getElementById("vet-list");
    const dialog = document.getElementById("vet-dialog");
    const dialogContent = document.getElementById("vet-dialog-content");
    const closeDialog = document.getElementById("close-dialog");

    container.innerHTML = ""; // Clear previous results

    vets.forEach(vet => {
        const vetItem = document.createElement("div");
        vetItem.className = "vet-item";
        vetItem.innerHTML = `
            <h3>${vet.name}</h3>
            <p><strong>Address:</strong> ${vet.vicinity}</p>
            <p><strong>Open Now:</strong> ${vet.opening_hours?.open_now ? "Yes ✅" : "No ❌"}</p>
            <button class="view-details" data-name="${vet.name}" data-address="${vet.vicinity}" data-status="${vet.opening_hours?.open_now ? "Yes ✅" : "No ❌"}">View Details</button>
        `;

        // When the button is clicked, open the dialog with clinic details
        vetItem.querySelector(".view-details").addEventListener("click", function() {
            const name = this.getAttribute("data-name");
            const address = this.getAttribute("data-address");
            const status = this.getAttribute("data-status");

            // Populate the dialog with details
            dialogContent.innerHTML = `
                <h2>${name}</h2>
                <p><strong>Address:</strong> ${address}</p>
                <p><strong>Open Now:</strong> ${status}</p>
            `;

            // Open the dialog
            dialog.showModal();
        });

        container.appendChild(vetItem);
    });

    // Close the dialog when the button is clicked
    closeDialog.addEventListener("click", () => {
        dialog.close();
    });
}

// Attach to the button
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("fetch-vets").addEventListener("click", getVetClinics);
});
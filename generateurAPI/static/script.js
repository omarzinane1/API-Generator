// ----------------------------
// Script JS central pour API dynamique
// ----------------------------

// Récupérer le token JWT depuis localStorage
function getToken() {
    return localStorage.getItem('token') || '';
}

// Options fetch avec JWT si nécessaire
function fetchWithAuth(url, method = 'GET', data = null) {
    const headers = {'Content-Type': 'application/json'};
    const token = getToken();
    if(token) headers['Authorization'] = 'Bearer ' + token;

    const options = {
        method,
        headers
    };

    if(data) options.body = JSON.stringify(data);

    return fetch(url, options)
        .then(res => res.json().then(json => ({ok: res.ok, status: res.status, body: json})))
        .catch(err => ({ok: false, body: {error: err}}));
}

// ----------------------------
// API - Création
// ----------------------------
async function createAPI(formId, resultId) {
    const form = document.getElementById(formId);
    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        const data = {
            name: form.name.value,
            type: form.type.value,
            model_name: form.model_name.value,
            schema: form.schema.value,
            endpoint: form.endpoint.value,
            method: form.method.value,
            permission: form.permission.value
        };

        const res = await fetchWithAuth('/api_manager/create', 'POST', data);

        const resultDiv = document.getElementById(resultId);
        if(res.ok){
            resultDiv.innerText = res.body.message || "API créée avec succès !";
            form.reset();
        } else {
            resultDiv.innerText = res.body.error || "Erreur inconnue";
        }
    });
}

// ----------------------------
// API - Chargement et tableau
// ----------------------------
async function loadApis(tableBodyId) {
    const res = await fetchWithAuth('/api_manager/list');
    const tbody = document.getElementById(tableBodyId);
    tbody.innerHTML = "";

    if(!res.ok) {
        tbody.innerHTML = `<tr><td colspan="10">Erreur: ${res.body.error || 'Impossible de charger les APIs'}</td></tr>`;
        return;
    }

    res.body.forEach(api => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${api.id}</td>
            <td>${api.name}</td>
            <td>${api.type}</td>
            <td>${api.model_name || '-'}</td>
            <td>${api.endpoint}</td>
            <td>${api.method}</td>
            <td>${api.active ? 'Oui' : 'Non'}</td>
            <td>${api.permission}</td>
            <td>${api.date_created}</td>
            <td>
                <button onclick="toggleApi(${api.id}, '${tableBodyId}')">${api.active ? 'Désactiver' : 'Activer'}</button>
                <button onclick="editApi(${api.id}, '${tableBodyId}')">Modifier</button>
                <button onclick="deleteApi(${api.id}, '${tableBodyId}')">Supprimer</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// ----------------------------
// API - Actions
// ----------------------------
async function toggleApi(id, tableBodyId) {
    const res = await fetchWithAuth(`/api_manager/toggle/${id}`, 'POST');
    alert(res.body.message || JSON.stringify(res.body));
    loadApis(tableBodyId);
}

async function deleteApi(id, tableBodyId) {
    if(!confirm("Voulez-vous vraiment supprimer cette API ?")) return;
    const res = await fetchWithAuth(`/api_manager/delete/${id}`, 'DELETE');
    alert(res.body.message || JSON.stringify(res.body));
    loadApis(tableBodyId);
}

async function editApi(id, tableBodyId) {
    const name = prompt("Nouveau nom API :");
    if(!name) return;

    const schema = prompt("Nouveau schema JSON :", "{}");
    const method = prompt("Nouvelle méthode (GET/POST) :", "GET");
    const permission = prompt("Nouvelle permission (private/public) :", "private");

    const res = await fetchWithAuth(`/api_manager/edit/${id}`, 'POST', {name, schema, method, permission});
    alert(res.body.message || JSON.stringify(res.body));
    loadApis(tableBodyId);
}

document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('novo-item');
    const button = document.getElementById('adicionar-item');
    const listaItens = document.getElementById('lista-itens');
    const alerts = document.getElementById('alerts');

    // Função para adicionar um item à lista
    button.addEventListener('click', () => {
        const itemTexto = input.value.trim();
        if (itemTexto) {
            const novoItem = document.createElement('li');
            novoItem.innerHTML = `
                <img src="./assets/checkbox.png" alt="checkbox" class="checkbox">
                <span>${itemTexto}</span>
                <img src="./assets/icon delete.png" alt="lixeira" class="delete-icon">
            `;
            listaItens.appendChild(novoItem);
            input.value = ''; // Limpar o campo de input
        }
    });

    // Função para remover um item da lista
    listaItens.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-icon')) {
            e.target.parentElement.remove();
            alerts.style.display = 'block'; // Exibir alerta
            setTimeout(() => alerts.style.display = 'none', 2000); // Ocultar alerta após 2 segundos
        }
    });
});

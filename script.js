const STORAGE_KEY = 'lista-compras-itens';
const STORAGE_KEY_ANTIGO = 'quicklist-itens';

const ITENS_INICIAIS = [
    'Arroz 5kg',
    'Feijão',
    'Óleo de soja',
    'Frango (bandeja)',
    'Detergente',
    'Papel higiênico',
    'Sabão em pó',
    'Café 500g',
];

function gerarId() {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
        return crypto.randomUUID();
    }
    return `item-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form-item');
    const input = document.getElementById('novo-item');
    const listaItens = document.getElementById('lista-itens');
    const listaVazia = document.getElementById('lista-vazia');
    const alerts = document.getElementById('alerts');
    const progressoNumero = document.getElementById('progresso-numero');
    const barraProgresso = document.getElementById('barra-progresso');
    const barraPreenchimento = document.getElementById('barra-preenchimento');

    let itens = carregarItens();

    function carregarItens() {
        try {
            const salvo = localStorage.getItem(STORAGE_KEY)
                ?? localStorage.getItem(STORAGE_KEY_ANTIGO);

            if (salvo) {
                const parsed = JSON.parse(salvo);
                if (Array.isArray(parsed)) {
                    if (!localStorage.getItem(STORAGE_KEY)) {
                        localStorage.setItem(STORAGE_KEY, salvo);
                    }
                    return parsed;
                }
            }
        } catch {
            /* ignora dados corrompidos */
        }

        const iniciais = ITENS_INICIAIS.map((texto) => ({
            id: gerarId(),
            texto,
            concluido: false,
        }));

        localStorage.setItem(STORAGE_KEY, JSON.stringify(iniciais));
        return iniciais;
    }

    function salvarItens() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(itens));
    }

    function atualizarProgresso() {
        const total = itens.length;
        const noCarrinho = itens.filter((item) => item.concluido).length;
        const percentual = total > 0 ? Math.round((noCarrinho / total) * 100) : 0;

        progressoNumero.textContent = `${noCarrinho}/${total}`;
        barraPreenchimento.style.width = `${percentual}%`;
        barraProgresso.setAttribute('aria-valuenow', String(percentual));
        barraProgresso.setAttribute('aria-valuemax', '100');
        barraProgresso.setAttribute('aria-label', `${percentual}% dos itens no carrinho`);
    }

    function mostrarAlertaRemocao() {
        alerts.hidden = false;
        clearTimeout(mostrarAlertaRemocao._timer);
        mostrarAlertaRemocao._timer = setTimeout(() => {
            alerts.hidden = true;
        }, 2200);
    }

    function renderizarLista() {
        listaItens.innerHTML = '';

        itens.forEach((item) => {
            const li = document.createElement('li');
            li.dataset.id = item.id;
            if (item.concluido) {
                li.classList.add('concluido');
            }

            const botaoCheck = document.createElement('button');
            botaoCheck.type = 'button';
            botaoCheck.className = 'checkbox';
            botaoCheck.setAttribute('aria-label', item.concluido ? 'Desmarcar do carrinho' : 'Marcar como no carrinho');
            botaoCheck.setAttribute('aria-pressed', String(item.concluido));

            const texto = document.createElement('span');
            texto.textContent = item.texto;

            const botaoRemover = document.createElement('button');
            botaoRemover.type = 'button';
            botaoRemover.className = 'delete-icon';
            botaoRemover.setAttribute('aria-label', `Remover ${item.texto}`);

            li.append(botaoCheck, texto, botaoRemover);
            listaItens.appendChild(li);
        });

        const vazia = itens.length === 0;
        listaVazia.hidden = !vazia;
        listaItens.hidden = vazia;
        atualizarProgresso();
    }

    function adicionarItem(texto) {
        const textoLimpo = texto.trim();
        if (!textoLimpo) return false;

        itens.push({
            id: gerarId(),
            texto: textoLimpo,
            concluido: false,
        });

        salvarItens();
        renderizarLista();
        return true;
    }

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        if (adicionarItem(input.value)) {
            input.value = '';
        }
        input.focus();
    });

    listaItens.addEventListener('click', (event) => {
        const li = event.target.closest('li');
        if (!li) return;

        const id = li.dataset.id;

        if (event.target.closest('.checkbox')) {
            itens = itens.map((item) =>
                item.id === id ? { ...item, concluido: !item.concluido } : item
            );
            salvarItens();
            renderizarLista();
            return;
        }

        if (event.target.closest('.delete-icon')) {
            itens = itens.filter((item) => item.id !== id);
            salvarItens();
            renderizarLista();
            mostrarAlertaRemocao();
        }
    });

    renderizarLista();
});

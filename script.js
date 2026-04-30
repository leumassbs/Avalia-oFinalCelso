const { createClient } = supabase

const SUPABASE_URL = 'https://axjjwjqlfsdqdhavjxxz.supabase.co'
const SUPABASE_KEY = 'sb_publishable_M2nOERa9XAgzo2Ga3OJJIA_e2e_WS2k'

const db = createClient(SUPABASE_URL, SUPABASE_KEY)

// Variável para guardar o ID do paciente que está sendo editado (se houver)
let editandoId = null;

// Função para buscar e mostrar os pacientes na tela
async function carregarPacientes() {
    const container = document.getElementById('pacientesContainer');
    
    // Busca todos os pacientes, ordenados pelo ID (mais antigos primeiro)
    const { data, error } = await db.from('pacientes').select('*').order('id', { ascending: true });

    if (error) {
        container.innerHTML = '<p style="color:red;">Erro ao carregar lista de pacientes.</p>';
        console.error('Erro ao buscar:', error);
        return;
    }

    if (data.length === 0) {
        container.innerHTML = '<p>Nenhum paciente cadastrado ainda.</p>';
        return;
    }

    // Limpa o container e adiciona os pacientes na tela
    container.innerHTML = '';
    data.forEach(paciente => {
        // Usa celular ou um texto padrão caso o celular esteja vazio
        const telefoneTexto = paciente.celular ? paciente.celular : 'Sem telefone';
        
        container.innerHTML += `
            <div class="paciente-item">
                <div class="paciente-info">
                    <strong>${paciente.nome}</strong>
                    <p>${telefoneTexto} | ${paciente.email}</p>
                </div>
                <div class="paciente-acoes">
                    <button class="btn-editar" onclick="prepararEdicao('${paciente.id}', '${paciente.nome}', '${paciente.celular || ''}', '${paciente.email}')">Editar</button>
                    <button class="btn-excluir" onclick="excluirPaciente('${paciente.id}')">Excluir</button>
                </div>
            </div>
        `;
    });
}

// Carrega a lista de pacientes assim que o arquivo JS é lido
carregarPacientes();

document.getElementById('cadastroForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const nome = document.getElementById('nome').value.trim();
    const celular = document.getElementById('telefone').value.trim();
    const email = document.getElementById('email').value.trim();

    if(!nome || !email){
        alert('Nome e e-mail são obrigatórios.');
        return;
    }

    if (editandoId) {
        // MODO EDIÇÃO: Atualiza o paciente existente
        const { error } = await db
            .from('pacientes')
            .update({ nome, celular, email })
            .eq('id', editandoId); // O 'eq' garante que só altera o paciente com este ID

        if (error) {
            alert('Erro ao atualizar: ' + error.message);
        } else {
            document.getElementById('msg').textContent = 'Paciente atualizado com sucesso!';
            cancelarEdicao(); // Limpa o modo de edição e reseta o form
            carregarPacientes(); // Atualiza a lista na tela
        }
    } else {
        // MODO CADASTRO: Insere um novo paciente
        const { error } = await db
            .from('pacientes')
            .insert([{ nome, celular, email }]);

        if (error) {
            alert('Erro ao salvar: ' + error.message);
        } else {
            document.getElementById('msg').textContent = 'Paciente cadastrado com sucesso!';
            this.reset();
            carregarPacientes(); // Atualiza a lista na tela
        }
    }
    
    // Some com a mensagem de sucesso depois de 3 segundos
    setTimeout(() => { document.getElementById('msg').textContent = ''; }, 3000);
});

// --- Função para preparar o formulário para edição ---
window.prepararEdicao = function(id, nome, celular, email) {
    document.getElementById('nome').value = nome;
    document.getElementById('telefone').value = celular;
    document.getElementById('email').value = email;
    
    editandoId = id; // Salva o ID para o evento submit saber que é um Update
    
    // Muda a aparência do formulário para indicar que é edição
    document.getElementById('formTitulo').textContent = 'Editando Paciente';
    document.getElementById('submitBtn').textContent = 'Atualizar';
    document.getElementById('cancelarBtn').style.display = 'block';
    
    window.scrollTo(0, 0); // Sobe a tela para o formulário
}

// --- Função para cancelar a edição (Botão Cancelar) ---
document.getElementById('cancelarBtn').addEventListener('click', cancelarEdicao);

function cancelarEdicao() {
    editandoId = null;
    document.getElementById('cadastroForm').reset();
    document.getElementById('formTitulo').textContent = 'Cadastro de Pacientes';
    document.getElementById('submitBtn').textContent = 'Cadastrar';
    document.getElementById('cancelarBtn').style.display = 'none';
}

// --- Função para excluir um paciente ---
window.excluirPaciente = async function(id) {
    // Pede confirmação antes de excluir
    if(confirm('Tem certeza que deseja excluir este paciente permanentemente?')) {
        const { error } = await db
            .from('pacientes')
            .delete()
            .eq('id', id);

        if (error) {
            alert('Erro ao excluir: ' + error.message);
        } else {
            carregarPacientes(); // Atualiza a lista na tela
        }
    }
}
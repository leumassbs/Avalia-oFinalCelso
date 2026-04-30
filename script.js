const { createClient } = supabase

const SUPABASE_URL = 'https://axjjwjqlfsdqdhavjxxz.supabase.co'
const SUPABASE_KEY = 'sb_publishable_M2nOERa9XAgzo2Ga3OJJIA_e2e_WS2k'

const db = createClient(SUPABASE_URL, SUPABASE_KEY)

// Teste de conexão
async function testarConexao() {
    const { data, error } = await db.auth.getSession()
    if (error) {
        console.error('Erro na conexão:', error)
    } else {
        console.log('Supabase conectado com sucesso!', data)
    }
}
testarConexao()
document.getElementById('cadastroForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Pega os valores e remove espaços em branco extras
    const nome = document.getElementById('nome').value.trim();
    const celular = document.getElementById('telefone').value.trim();
    const email = document.getElementById('email').value.trim();

    // Valida se está em branco
    if(!nome || !email){
        alert('Nome e e-mail são obrigatórios.');
        return;
    }

    // Comando para inserir no Supabase
    const { data, error } = await db
        .from('pacientes')
        .insert([{ nome, celular, email }]);

    // Mostra resultado e limpa o formulário apenas se der certo
    if (error) {
        alert('Erro ao salvar: ' + error.message);
    } else {
        document.getElementById('msg').textContent = 'Paciente salvo no banco com sucesso!';
        this.reset();
    }
});
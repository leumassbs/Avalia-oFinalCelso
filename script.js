document.getElementById('cadastroForm').addEventListener('submit', function(e){
    e.preventDefault();
    const nome = document.getElementById('nome').value.trim();
    const telefone = document.getElementById('telefone').value.trim();
    const email = document.getElementById('email').value.trim();
    if(!nome || !email){
        alert('Nome e e-mail são obrigatórios.');
        return;
    }

    const msg = document.getElementById('msg');
    msg.textContent = 'Paciente cadastrado com sucesso.';
    this.reset();
});

const { createClient } = supabase

const SUPABASE_URL = 'https://iepxtpkmhxnsbhudhxkq.supabase.co'
const SUPABASE_KEY = 'sb_publishable_fMieAbuMOB19cU4QAtCxbQ_H0foIs5l'

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
    
    const nome = document.getElementById('nome').value;
    const celular = document.getElementById('telefone').value;
    const email = document.getElementById('email').value;

    // Comando para inserir no Supabase
    const { data, error } = await db
        .from('pacientes')
        .insert([{ nome, celular, email }]);

    if (error) {
        alert('Erro ao salvar: ' + error.message);
    } else {
        document.getElementById('msg').textContent = 'Paciente salvo no banco com sucesso!';
        this.reset();
    }
});
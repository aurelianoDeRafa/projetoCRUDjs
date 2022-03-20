'use strict'

const openModal = () => document.getElementById('modal')
    .classList.add('active')

const closeModal = () => {
  /**vai limpar os campos do form depois de salvar */
  clearFields()
  document.getElementById('modal').classList.remove('active')
}
const closeX = () => {
  document.getElementById('modal').classList.remove('active')
}





const getLocalStorage = () => {
  /**ele vai pegar o que ta no localStorage e transformar e JSON . caso nao tenha nada no localStorage, ele vai pegar um array vazio*/
 return JSON.parse(localStorage.getItem('db_client')) ?? [];
}

const setLocalStorage = (dbClient) => {
  /**vai adicionar os dados dos cliente no localStorage. precisamos transformar ele em string */
  localStorage.setItem('db_client', JSON.stringify(dbClient))
}



//CRUD - create, read, updata e delete ⬇
//DELETE
const deleteClient = (index) => {
  const dbClient = readClient();
  dbClient.splice(index, 1);

  setLocalStorage(dbClient)
}

//UPDATE
const updateClient = (index, client) => {
  /**vai ler todos os dados que esta no banco de dados'localStorage' e colocar dentro da variável dbClient */
  const dbClient = readClient();

  /**vai pegar o index do cliente para saber qual cliente que é, e manda nova a atualização do client */
  dbClient[index] = client;

  /**vai manda pro localStorage */
  setLocalStorage(dbClient)
}

//READ
const readClient = () => getLocalStorage()

// CREATE
const createClient = (client) => {
  const dbClient = getLocalStorage()
 
  /**ele vai pegar as informações que está vindo do parâmetro e adicionando no db_client */
  dbClient.push(client)

  setLocalStorage(dbClient)
  
}



const isValidFields = () => {
  /** O reportValidity(), vai verificar se todos os requisito foi atendido naquele form. ele retorna true ou false */
  return document.getElementById('form').reportValidity()
}

//Interação com layout

const clearFields = () => {
  const fields = document.querySelectorAll('.modal-field')
  fields.forEach(field => field.value = "")
}

const savaClient = () => {
  /** se o isisValidFields for true, vai cadastrar */
  if (isValidFields()) {
    /**aqui é um JSON, ta pegando as informações no form  */
    const client = {
      nome: document.getElementById('nome').value,
      email: document.getElementById('email').value,
      celular: document.getElementById('celular').value,
      cidade: document.getElementById('cidade').value
    }
    const index = document.getElementById('nome').dataset.index

    if (index == 'new') {
      //**passando o json pra função creatClient */
      createClient(client);
      updateTable()
      closeModal()
    } else {
      updateClient(index, client)
      updateTable()
      closeModal()
    }
  }
}


const createRow = (client, index) => {
  /**aqui a gente criar um elemento html */
  const newRow = document.createElement('tr')
  /**aqui estamos criando um elemento dentro do tag tr, lembrando que esse elemento esta so na memória   */
  newRow.innerHTML = `
  <td>${client.nome}</td>
  <td>${client.email}</td>
  <td>${client.celular}</td>
  <td>${client.cidade}</td>
  <td>
      <button type="button" class="button green" id="edit-${index}">Editar</button>
      <button type="button" class="button red" id="delete-${index}">Excluir</button>
  </td>
  `
  /**aqui nos passamos o elemento pro DOM */
  document.querySelector('#tableClient>tbody').appendChild(newRow)
}

const clearTable = () => {
  const rows = document.querySelectorAll('#tableClient>tbody tr')
  /**ele vai pegar todos os items que esta dentro do tr, e vai achar o pai deles, que é o parentNode=(tbody) e remover o filho=removeChild(row) do tbody */
  rows.forEach(row => row.parentNode.removeChild(row))
}


/**aqui ele vai pegar o dados que esta no localStorage item a item e manda pro createRow */
const updateTable = () => {
  const dbClient = readClient();
  clearTable()
  dbClient.forEach(createRow)
}

const fillFields = (client) => {
  /** */
      document.getElementById('nome').value = client.nome
      document.getElementById('email').value = client.email
      document.getElementById('celular').value = client.celular
      document.getElementById('cidade').value = client.cidade
      document.getElementById('nome').dataset.index = client.index
}
const editClient = (index) => {
  const client = readClient()[index]
  client.index = index
  fillFields(client)
  openModal()
}


const editDelete = (event) => {
  if (event.target.type  == 'button') {
    /**a primeira posição vai ser o evento e a segunda vai ser id */
    const [action, index] = event.target.id.split('-')
    
    if (action == 'edit') {
      editClient(index)
    } else {
      const client = readClient()[index]
      const response = confirm(`Deseja realmente excluir o cliente ${client.nome}`)
      if (response) {
        deleteClient(index)
        updateTable()
      }
    }
 }
}


updateTable()



//eventos
document.getElementById('cadastrarCliente')
    .addEventListener('click', openModal)

document.getElementById('modalClose')
    .addEventListener('click', closeModal)

document.getElementById('cancelar')
    .addEventListener('click', closeX)

document.getElementById('salvar')
    .addEventListener('click', savaClient)

document.querySelector('#tableClient>tbody')
    .addEventListener('click', editDelete)
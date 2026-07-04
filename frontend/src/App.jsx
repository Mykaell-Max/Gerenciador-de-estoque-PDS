import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [usuario, setUsuario] = useState("")
  const [senha, setSenha] = useState("")
  const [logado, setLogado] = useState(false)

  async function realizarLogin() {
    const dados = {
      usuario: usuario,
      senha: senha
    }
    const resposta = await fetch("http://127.0.0.1:8000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(dados)
    })
    const dadosResposta = await resposta.json()
    console.log(dadosResposta)
    setLogado(true)
  }

  function alteraUser(evento) {
    setUsuario(evento.target.value)
  }

  function alteraSenha(evento) {
    setSenha(evento.target.value)
  }

  if(logado) {
    return (<TelaAdmin></TelaAdmin>)
  }

  return (
    <>

      <section id="login">
        <div>
          <form>
            <label>Usuário: </label>
            <input value={usuario} onChange={alteraUser} type="text"/>
            <br /> <br />

            <p>{usuario}</p>
            <br /><br />


            <label>Senha: </label>
            <input value={senha} onChange={alteraSenha} type="password"/>
            <br /><br />
            <p>{senha}</p>


            <button type="button" onClick={realizarLogin}>Entrar</button>
          </form>
        </div>
      </section>
    </>
  )
}

function TelaAdmin() {
  const [usuario, setUsuario] = useState("")
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [tipo, setTipo] = useState("C")

  function alteraUsuario(evento) {
    setUsuario(evento.target.value)
  }

  function alteraSenha(evento) {
    setSenha(evento.target.value)
  }

  function alteraEmail(evento) {
    setEmail(evento.target.value)
  }

  function alteraTipo(evento) {
    setTipo(evento.target.value)
  }

  function realizaCadastro() {
    setUsuario("")
    setSenha("")
    setEmail("")
    setTipo("C")
  }


  return (
    <>
      <section id="form-cadastro">
        <div>
          <label>Usuario: </label>
          <input value={usuario} onChange={alteraUsuario} type="text"/>
          <br /><br />

          <label>Email: </label>
          <input value={email} onChange={alteraEmail} type="email"/>
          <br /><br />

          <label>Senha: </label>
          <input value={senha} onChange={alteraSenha} type="password"/>
          <br /><br />

          <label>Tipo:</label>
          <select value={tipo} onChange={alteraTipo} id="tipo-usuario">
            <option value="A">Admin</option>
            <option value="C">Padrão</option>
          </select>
          <br /><br />

          <button onClick={realizaCadastro} type="button">Cadastrar</button>

        </div>
      </section>
    
    
    
    </>
  )
}

export default App

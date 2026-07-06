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
  const [tipo, setTipo] = useState("")
  const [message, setMessage] = useState("")

  async function realizarLogin() {
    if(usuario.trim() == "" || usuario.length < 3) {
      setMessage("Insira um usuário válido.")
      return
    }

    if(senha.trim == "" || senha.length < 8) {
      setMessage("Insira uma senha válida.")
      return
    }

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
    if(dadosResposta.sucess) {
      setLogado(true)
      setTipo(dadosResposta.tipo)
      setUsuario("")
      setSenha("")
      setMessage("")
    } else {
      setMessage(dadosResposta.message)
    }
  }

  function alteraUser(evento) {
    setUsuario(evento.target.value)
  }

  function alteraSenha(evento) {
    setSenha(evento.target.value)
  }

  if(logado) {
    if(tipo == "A") {
      return <TelaAdmin setLogado={setLogado}/>
    }
    return <TelaUsuario setLogado={setLogado}/>
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
        <hr />
        <div>
          <p>{message}</p>
        </div>
      </section>
    </>
  )
}

function TelaAdmin(props) {
  const [usuario, setUsuario] = useState("")
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [tipo, setTipo] = useState("C")
  const [message, setMessage] = useState("")

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

  async function realizaCadastro() {
    if(usuario.trim() == "") {
      setMessage("Usuário não pode estar vazio.")
      return
    }

    if(usuario.length < 3) {
      setMessage("Usuário deve ter no mínimo 3 caracteres.")
      return
    }

    if(email.trim() == "") {
      setMessage("Email não pode estar vazio.")
      return
    }

    if(!email.includes("@") || !email.includes(".com")) {
      setMessage("Email em um formato inválido.")
      return
    }

    if(senha.trim() == "") {
      setMessage("Senha não pode estar vazia.")
      return
    }

    if(senha.length < 8) {
      setMessage("Senha deve ter no mínimo 8 caracteres.")
      return
    }
  
    const dados = {
      usuario,
      email,
      senha,
      tipo
    }
    const resposta = await fetch("http://127.0.0.1:8000/cadastrar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(dados)
    })
    const dadosResposta = await resposta.json()
    console.log(dadosResposta)
    if(dadosResposta.sucess) {
      setUsuario("")
      setSenha("")
      setEmail("")
      setTipo("C")
    }
    setMessage(dadosResposta.message)
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
          <hr />
          <button onClick={()=> sair(props.setLogado)}>Sair</button>

        </div>
        <hr />
        <div>
          <p>{message}</p>
        </div>
      </section>
    </>
  )
}

function TelaUsuario(props) {
  const [funcao, setFuncao] = useState("Estoque")


  return (
    <>
      <h1>Olá, {}</h1>

      <button onClick={()=> setFuncao("Estoque")}>Estoque</button>
      <br /><br />
      <button onClick={()=> setFuncao("Caixa")}>Caixa</button> 
      <hr />
      <button onClick={()=> sair(props.setLogado)}>Sair</button>

      {(funcao == "Estoque" && <TelaEstoque />)}
      {(funcao == "Caixa" && <TelaCaixa />)}   
    
    
    </>

  )
}

function TelaEstoque() {



  return (
    <>
      <h1>Está no modo estoque</h1>
    
    
    
    </>
  )
}

function TelaCaixa() {



  return (
    <>
      <h1>Está no modo caixa</h1>

    </>
  )

}

function sair(setLogado) {
  setLogado(false)
}

export default App

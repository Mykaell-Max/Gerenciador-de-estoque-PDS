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
  const [cod, setCod] = useState("")
  const [nome, setNome] = useState("")
  const [desc, setDesc] = useState("")
  const [lote, setLote] = useState("")
  const [qtd, setQtd] = useState("")
  const [message, setMessage] = useState("")

  function alteraCod(evento) {
    setCod(evento.target.value)
  }

  function alteraNome(evento) {
    setNome(evento.target.value)
  }

  function alteraDesc(evento) {
    setDesc(evento.target.value)
  }

  function alteraQtd(evento) {
    setQtd(evento.target.value)
  }

  function alteraLote(evento) {
    setLote(evento.target.value)
  }

  async function cadastraProduto() {
    //Validações

    if(cod.trim() == "") {
      setMessage("Código não pode estar vazio.")
      return
    }

    if(cod.length < 5) {
      setMessage("Código deve ter no mínimo 5 caracteres.")
      return
    }

    if(nome.trim() == "") {
      setMessage("Nome não pode estar vazio.")
      return
    }

    if(nome.length < 3) {
      setMessage("Nome deve ter no mínimo 3 caracteres.")
      return
    }

    if(desc.trim() == "") {
      setMessage("Descrição não pode estar vazia.")
      return
    }

    if(lote.trim() == "") {
      setMessage("Lote não pode estar vazio.")
      return
    }

    if(lote.length < 6) {
      setMessage("Usuário deve ter no mínimo 6 caracteres.")
      return
    }

    if(qtd.trim() == "") {
      setMessage("Quantidade inicial não pode estar vazia.")
      return
    }

    const dados = {
      cod,
      nome,
      desc,
      lote,
      qtd
    }
    const resposta = await fetch("http://127.0.0.1:8000/cadastrarProduto", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(dados)
    })
    const dadosResposta = await resposta.json()
    console.log(dadosResposta)
    if(dadosResposta.sucess) {
      setCod("")
      setNome("")
      setDesc("")
      setLote("")
      setQtd("")
    } 
    setMessage(dadosResposta.message)
  }


  //Fazer apresentação de produtos depois
  return (
    <>
      <h1>Modo: Estoque</h1>
       <section>
        <div>
          <form>
            <label>Código: </label>
            <input type="text" value={cod} onChange={alteraCod}/>
            <br /><br />
            
            <label>Nome: </label>
            <input type="text" value={nome} onChange={alteraNome}/>
            <br /><br />

            <label>Descrição: </label>
            <input type="text" value={desc} onChange={alteraDesc}/>
            <br /><br />

            <label>Lote: </label>
            <input type="text" value={lote} onChange={alteraLote}/>
            <br /><br />

            <label>Quantidade Inicial: </label>
            <input type="text" value={qtd} onChange={alteraQtd}/>
            <br /><br />


            <button type="button" onClick={cadastraProduto}>Cadastrar</button>
          </form>
          <hr />
          <p>{message}</p>
        </div>
       </section>
    
    
    
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

import { Box, Text, TextField, Image, Button } from "@skynexui/components";
import React from "react";
import appConfig from "../config.json";
import {useRouter} from 'next/router'
import { createClient } from '@supabase/supabase-js'
import { ButtonSendSticker } from '../src/components/ButtonSendSticker';

const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MzY3Mzc3OCwiZXhwIjoxOTU5MjQ5Nzc4fQ.p88mzBfM3vuxUzFi8K6eILKwPD1LdcXBmF5RTFw2kz0';
const SUPABASE_URL = 'https://lkobadvrgszvekxpnrto.supabase.co';
const supabaseClient = createClient(SUPABASE_URL,SUPABASE_ANON_KEY);





export default function ChatPage() {
  const roteamento = useRouter();
  const usuarioLogado = roteamento.query.username;
  console.log('usuarioLogado', usuarioLogado)
  console.log('roteamento.query',roteamento.query)
  const [mensagem, setMensagem] = React.useState("");
  const [listaDeMensagens, setlistaDeMensagens] = React.useState([
    //{
    //  id: 1,
    //  de: 'LeandroDominguez',
    //  texto: ':sticker: https://www.alura.com.br/imersao-react-4/assets/figurinhas/Figurinha_3.png',
   // },
    //{
    //  id: 2,
    //  de: 'peas',
    //  texto: 'O terdário',
    //}
  ]);

  React.useEffect(() => {
    supabaseClient
    .from('mensagens')
    .select('*')
    .order('id',{ascending: false})
    .then(({data}) =>{
      console.log('Dados da consulta:',data );
      setlistaDeMensagens(data);
    });    
  },[]);
  
  // Sua lógica vai aqui
  /*
    //Usuário
      
    -Usuário digita no campo textArea
    -Aperta enter para enviar
    -Tem que adicionar o texto no chat listagem

    //Dev
    -[x] Campo de digitar texto
    -[] Vamos usar o onChange usar o useState (ter if no caso de enter limpar a variavel)
    -[] Listar as mensagens
    */

  // ./Sua lógica vai aqui
  function handleNovaMensagem(novaMensagem) {
    const mensagem = {
      id: listaDeMensagens.length + 1,
      de: usuarioLogado,
      texto: novaMensagem,
    };
    supabaseClient
    .from('mensagens')
    .insert([
      mensagem
    ])  
    .then (({data}) => {
      console.log('criando mensagem:',data)
      setlistaDeMensagens([
        data[0],
        ...listaDeMensagens,
      ]);
        
     
    });

  

  setMensagem("");
}

  return (
    <Box
      styleSheet={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: appConfig.theme.colors.primary[500],
        backgroundImage: `url(https://virtualbackgrounds.site/wp-content/uploads/2020/08/the-matrix-digital-rain.jpg)`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundBlendMode: "multiply",
        color: appConfig.theme.colors.neutrals["000"],
      }}
    >
      <Box
        styleSheet={{
          display: "flex",
          flexDirection: "column",
          flex: 1,
          boxShadow: "0 2px 10px 0 rgb(0 0 0 / 20%)",
          borderRadius: "5px",
          backgroundColor: appConfig.theme.colors.neutrals[700],
          height: "100%",
          maxWidth: "95%",
          maxHeight: "95vh",
          padding: "32px",
        }}
      >
        <Header />
        <Box
          styleSheet={{
            position: "relative",
            display: "flex",
            flex: 1,
            height: "80%",
            backgroundColor: appConfig.theme.colors.neutrals[600],
            flexDirection: "column",
            borderRadius: "5px",
            padding: "16px",
          }}
        >
          <MessageList mensagens={listaDeMensagens} />

          {/*{listaDeMensagens.map((mensagemAtual) => {                        
                        return (
                            <li key={mensagemAtual.id}>
                                {mensagemAtual.de}: {mensagemAtual.texto}
                            </li>
                        )               
                        
                    })}*/}

          <Box
            as="form"
            styleSheet={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <TextField
              value={mensagem}
              onChange={(event) => {
                const valor = event.target.value;
                setMensagem(valor);
              }}
              onKeyPress={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  handleNovaMensagem(mensagem);
                }
              }}
              placeholder="Insira sua mensagem aqui..."
              type="textarea"
              styleSheet={{
                width: "100%",
                border: "0",
                resize: "none",
                borderRadius: "5px",
                padding: "6px 8px",
                backgroundColor: appConfig.theme.colors.neutrals[800],
                marginRight: "12px",
                color: appConfig.theme.colors.neutrals[200],
              }}
            />
            <ButtonSendSticker
              onStickerClick={(sticker)=>{
                console.log('[usando o componente] Salva o sticker no banco', sticker);
                handleNovaMensagem(':sticker:' + sticker);
              }}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

function Header() {
  return (
    <>
      <Box
        styleSheet={{
          width: "100%",
          marginBottom: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text variant="heading5">Chat</Text>
        <Button
          variant="tertiary"
          colorVariant="neutral"
          label="Logout"
          href="/"
        />
      </Box>
    </>
  );
}

function MessageList(props) {
  console.log(props);
  return (
    <Box
      tag="ul"
      styleSheet={{
        overflow: "scroll",
        display: "flex",
        flexDirection: "column-reverse",
        flex: 1,
        color: appConfig.theme.colors.neutrals["000"],
        marginBottom: "16px",
      }}
    >
      {props.mensagens.map((mensagem) => {
        return (
          <Text
            key={mensagem.id}
            tag="li"
            styleSheet={{
              borderRadius: "5px",
              padding: "6px",
              marginBottom: "12px",
              hover: {
                backgroundColor: appConfig.theme.colors.neutrals[700],
              },
            }}
          >
            <Box
              styleSheet={{
                marginBottom: "8px",
              }}
            >
              <Image
                styleSheet={{
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  display: "inline-block",
                  marginRight: "8px",
                }}
                src={`https://github.com/${mensagem.de}.png`}
              />
              <Text tag="strong">{mensagem.de}</Text>
              <Text
                styleSheet={{
                  fontSize: "10px",
                  marginLeft: "8px",
                  color: appConfig.theme.colors.neutrals[300],
                }}
                tag="span"
              >
                {new Date().toLocaleDateString()}
              </Text>
            </Box>
          {/*{mensagem.texto.startsWith(':sticker:').toString()}*/}
              {mensagem.texto.startsWith(':sticker:') 
                ? (
                <Image src={mensagem.texto.replace(':sticker:','')}
                styleSheet={{
                  width: '15%',
                }}        
                /> 
                ) :(
                  mensagem.texto
              )}             
          </Text>
        );
      })}
    </Box>
  );
}

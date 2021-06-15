exports.textMenu = (pushname, prefix) => {
    return `
╔─━━━━━━ ★ ━━━━━━─╗
                   †千P_乃ㄖㄒ†       
╚─━━━━━━ ★ ━━━━━━─╝
｢ Olá ${pushname} obrigado por usar o FP-BOT. ｣
Prefixo: ｢ ${prefix} ｣
▔▔▔▔▔▔▔▔▔▔▔▔▔▔
Principais
-> ${prefix}menu (Veja uma lista de comandos)
-> ${prefix}ia (Converse com o bot!)

▔▔▔▔▔▔▔▔▔▔▔▔▔▔
Figurinha

-> ${prefix}sticker (Faz figurinhas)
-> ${prefix}ttp (Transforma texto em figurinha)
-> ${prefix}toimg (Transforma figurinha em imagem)
-> ${prefix}gifsticker (Transforma video em stickers)

▔▔▔▔▔▔▔▔▔▔▔▔▔▔
Legenda/Velocidade

-> ${prefix}cc (Escreve em uma imagem)
-> ${prefix}ping (Verifica a velocidade do bot)

▔▔▔▔▔▔▔▔▔▔▔▔▔▔
Audio

-> ${prefix}ltts (lista de todas as linguagens disponiveis)
-> ${prefix}tts (Faz um audio com uma menssagem de texto)

▔▔▔▔▔▔▔▔▔▔▔▔▔▔
Link

-> ${prefix}grouplink (Gera um link do grupo)

▔▔▔▔▔▔▔▔▔▔▔▔▔▔
Diversão

-> ${prefix}whoanime (Tenta adivinhar o nome de um anime)
-> ${prefix}ship (Junta duas pessoas em um casal)
-> ${prefix}neko (Imagens neko com 1 base)
-> ${prefix}neko2 (Imagens neko com 2 bases)
-> ${prefix}neko3 (Imagens neko com 3 bases)
-> ${prefix}waifu (Imagens de waifus)
-> ${prefix}waifustk (Imagens de waifus em sticker)
-> ${prefix}randomanime (Imagens aleatorias de animes)
-> ${prefix}dn (Death Note)
-> ${prefix}flip (Gira uma moeda)
-> ${prefix}wasted (Faz uma imagem de procurado)
-> ${prefix}fox (Raposinhas!)
-> ${prefix}loli (Imagens de lolis ojo [FBI!!!!])
-> ${prefix}randomhentai (Envia Hentais)
-> ${prefix}girl (Imagens de meninas)
-> ${prefix}oculto (Um comando oculto para semear o caôs)
-> ${prefix}detector (Detector de gostosas)
-> ${prefix}corno (Mede o tamanho do teu chifre)
-> ${prefix}gay (Mede a viadagem em você)
-> ${prefix}fofo (Mede a sua fofura)

▔▔▔▔▔▔▔▔▔▔▔▔▔▔
Assinaturas premium 

-> ${prefix}assinatura (tabela de venda de assinaturas)

▔▔▔▔▔▔▔▔▔▔▔▔▔▔
Criado por: Torticto
Contato: wa.me/5516982005586

▔▔▔▔▔▔▔▔▔▔▔▔▔▔
`
}

exports.textAdmin = (pushname, prefix) => {
    return `
⚠ [ ${pushname} ] ⚠
⚠ [ Somente para admins do grupo ] ⚠ 

-> ${prefix}kick
Remove membros do grupo (obs: pode ser mais de um a ser banido).
Uso: ${prefix}kick @menção

-> ${prefix}promote
Promove membros do grupo para admins.
Uso: ${prefix}promote @menção

-> ${prefix}demote
Transforma admins em membros comuns.
Uso: ${prefix}demote @menção`
}

exports.textDono = (pushname, prefix) => {
	return `
⚠ -[ *MENU DONO* ]- ⚠ 

-> ${prefix}say
-> ${prefix}ban
-> ${prefix}pardon
-> ${prefix}setprefix
-> ${prefix}addpremium
-> ${prefix}removepremium
-> ${prefix}addarch
-> ${prefix}removearch
-> ${prefix}tagall
-> ${prefix}removeadm
-> ${prefix}del
-> ${prefix}botstat
`
}
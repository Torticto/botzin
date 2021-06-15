exports.textMenu = (pushname) => {
    return `
:------------------------------------------------------->
:Olá, ${pushname}! 👋️
:Aqui estão os comandos do bot! ✨
:------------------------------------------------->
:<x>*!menu*<x>
:Exibe uma lista com todos os comandos (Esta lista :P)
:------------------------------------------------->
:<x>*!sticker*<x>
:Transforma imagens em figuinhas.
:-Uso: Envie imagens com a legenda !sticker ou
:marque uma imagem com !sticker
:------------------------------------------------->
:<x>*!gifsticker*<x>
:-Uso: Envie um video com a legenda !gifsticker. (((DESATIVADO)))
:------------------------------------------------->
:<x>*!ping*<x>
:Verifica a velocidade de resposta do bot.
:------------------------------------------------->
:<x>*!cc*<x>
:Faz uma legenda na parte superior e inferior de
:uma imagem 
:-Uso: !cc superior | inferior
:------------------------------------------------->
:Com amor e carinho 𝑃𝐶𝑊¹⁵⁷❄️丂ㄩ卩尺乇爪乇 - 千ㄖ乂❄️
:Numero do criador: wa.me/5562996314606
:------------------------------------------------------->`
}

exports.textAdmin = () => {
    return `
⚠ [ *Somente para admins do grupo* ] ⚠ 

<x>*!kick*<x>
Remove membros do grupo (obs: pode ser mais de um a ser banido).    n precisa mexer ai
Uso: !kick @menção

<x>*!promote*<x>
Promove membros do grupo para admins.
Uso: !promote @menção

<x>*!demote*<x>
Transforma admins em membros comuns.
Uso: !demote @menção`
}

require('dotenv').config()
const fs = require('fs-extra')
const { decryptMedia, Client } = require('@open-wa/wa-automate')
const moment = require('moment-timezone')
moment.tz.setDefault('Asia/Jakarta').locale('id')
const { downloader, cekResi, removebg, urlShortener, meme, translate, getLocationData } = require('../../lib')
const { msgFilter, color, processTime, is } = require('../../utils')
const mentionList = require('../../utils/mention')
const { getBuffer, getRandom, tulis, sleep, randomNimek } = require('../../utils/functions')
const { uploadImages } = require('../../utils/fetcher')
const { fetchJson } = require('../../utils/fetcher')
const config = require('../../config/config.json')
const axios = require('axios')
const imgbbUploader = require('imgbb-uploader')
const sinesp = require('sinesp-api')
const { removeBackgroundFromImageBase64 } = require('remove.bg')

const ban = JSON.parse(fs.readFileSync('./lib/banned.json'))
const premium = JSON.parse(fs.readFileSync('./lib/premium.json'))
const archive = JSON.parse(fs.readFileSync('./lib/canarchive.json'))

const { exec } = require('child_process')

const { menuId, menuEn } = require('./text')

prefix = '!'

module.exports = msgHandler = async (client, message) => {
    try {
        const { type, id, from, t, sender, isGroupMsg, chat, caption, isMedia, isGif, mimetype, quotedMsg, quotedMsgObj, mentionedJidList } = message
        const isQuotedVideo = quotedMsg && quotedMsg.type === 'video'
        const isQuotedSticker = quotedMsg && quotedMsg.type === 'sticker'
        const isQuotedGif = quotedMsg && quotedMsg.mimetype === 'image/gif'
        let { body, author } = message
        const { name, formattedTitle } = chat
        let { pushname, verifiedName, formattedName } = sender
        pushname = pushname || verifiedName || formattedName // verifiedName is the name of someone who uses a business account
        const botNumber = await client.getHostNumber() + '@c.us'
        const groupId = isGroupMsg ? chat.groupMetadata.id : ''
        const groupAdmins = isGroupMsg ? await client.getGroupAdmins(groupId) : ''
        const groupMembers = isGroupMsg ? await client.getGroupMembersId(groupId) : ''
        const isGroupAdmins = groupAdmins.includes(sender.id) || false
        const isBotGroupAdmins = groupAdmins.includes(botNumber) || false
        const owner = '5516981627859'
        const isowner = owner+'@c.us' == sender.id 
        const isBanned = ban.includes(sender.id)
        const canArchive = archive.includes(sender.id)
        const ispremium = premium.includes(sender.id)
/*
        body = (type === 'chat' && body.startsWith(prefix)) ? body : (((type === 'image' || type === 'video') && caption) && caption.startsWith(prefix)) ? caption : ''
        const command = body.slice(1).trim().split(/ +/).shift().toLowerCase()
        const arg = body.substring(body.indexOf(' ') + 1)
        const args = body.trim().split(/ +/).slice(1)
        const isCmd = body.startsWith(prefix)
        const isQuotedImage = quotedMsg && quotedMsg.type === 'image'
        const url = args.length !== 0 ? args[0] : ''
        const uaOverride = process.env.UserAgent
        const double = Math.floor(Math.random() * 2) + 1
        const lvpc = Math.floor(Math.random() * 100) + 1
*/
		body = (type === 'chat') ? body : (((type === 'image' || type === 'video') && caption)) ? caption : ''
        const command = body.slice(1).trim().split(/ +/).shift().toLowerCase()
        const arg = body.substring(body.indexOf(' ') + 1)
        const args = body.trim().split(/ +/).slice(1)
        const isCmd = body.startsWith(prefix)
        const isQuotedImage = quotedMsg && quotedMsg.type === 'image'
        const url = args.length !== 0 ? args[0] : ''
        const uaOverride = process.env.UserAgent
        const double = Math.floor(Math.random() * 2) + 1
        const lvpc = Math.floor(Math.random() * 100) + 1

        // [BETA] Avoid Spam Message
//        if (isCmd && msgFilter.isFiltered(from) && !isGroupMsg) { return console.log(color('[SPAM]', 'red'), color(moment(t * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), color(`${command} [${args.length}]`), 'from', color(pushname)) }

//        if (isCmd && msgFilter.isFiltered(from) && !isGroupMsg) { return client.sendText(from, `[Aguarde alguns segundos para enviar outro comando]`) }

//        if (isCmd && msgFilter.isFiltered(from) && isGroupMsg) { return console.log(color('[SPAM]', 'red'), color(moment(t * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), color(`${command} [${args.length}]`), 'from', color(pushname), 'in', color(name || formattedTitle)) }

//    if (isCmd && msgFilter.isFiltered(from) && isGroupMsg) { return client.sendText(from, `Aguarde alguns segundo para enviar outro comando`) }
        //
		if (!isCmd && !isGroupMsg) {  console.log('[RECV]', color(moment(t * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), 'Message from', color(pushname)) }
        if (!isCmd && isGroupMsg) { console.log('[RECV]', color(moment(t * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), 'Message from', color(pushname), 'in', color(name || formattedTitle)) }
        if (isCmd && !isGroupMsg) { console.log(color('[EXEC]'), color(moment(t * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), color(`${command} [${args.length}]`), 'from', color(pushname)) }
        if (isCmd && isGroupMsg) { console.log(color('[EXEC]'), color(moment(t * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), color(`${command} [${args.length}]`), 'from', color(pushname), 'in', color(name || formattedTitle)) }
        
        msgFilter.addFilter(from)

        switch (command) {

        case 'speed':
        case 'ping':
            await client.reply(from, `Velocidade: ${processTime(t, moment())} *segundos*`, id)
        break

        case 'menu':
        case 'menupt':
        case 'ajuda':
        case 'lista':
        case 'comandos':
        case '?':
        case 'help':
            if (isBanned) return client.reply(from, `Desculpe, você está banido deste bot...`, id)
            await client.reply(from, menuId.textMenu(pushname, prefix), id)
                .then(() => ((isGroupMsg) && (isGroupAdmins)) ? client.sendText(from, `Menu Admin do grupo: *${prefix}menuadmin*`) : null)
            if (isowner) { await client.sendText(from, `Olá dono! Digite *${prefix}menudono* para ver uma lista de comandos só para o dono!`, id) }
            if (ispremium) { await client.sendText(from, `Olá dono! Digite *${prefix}menudono* para ver uma lista de comandos só para o dono!`, id) }
        break
        
        case 'ferramentas':
        case 'ferramenta':
            if (isBanned) return client.reply(from, `Desculpe, você está banido deste bot...`, id)
            await client.reply(from, menuId.textFerramentas(pushname, prefix), id)
        break

        case 'premium':
        case 'premiummenu':
        case 'menupremium':
        case 'paidmenu':
        case 'paid':
        case 'premiumcmd':
        case 'premiumcommands':
        case 'comandospremium':
            if (isBanned) return client.reply(from, `Desculpe, você está banido deste bot...`, id)
            if (!ispremium) {
                await client.reply(from, menuId.textPremium(pushname, prefix), id)
                await client.sendText(from, `Você ainda não é um usuário premium... Compre premium com ${prefix}comprarpremium`)
            } else {
                await client.reply(from, menuId.textPremium(pushname, prefix), id)
                await client.sendText(from, `Obrigado por comprar o bot premium!`)
            }
        break

        case 'comprarpremium':
            if (isBanned) return client.reply(from, `Desculpe, você está banido deste bot...`, id)
            client.reply(from, `EM DESENVOLVIMENTO...`, id)
        break

        case 'ownermenu':
        case 'menudono':
            if (!isowner) return client.reply(from, `Desculpe você não é o dono deste bot!`, id)
            await client.reply(from, menuId.textDono(pushname, prefix), id)
        break

        case 'setprefix':
            if (!isowner) return client.reply(from, `${pushname} você não é o dono do bot! >:(`, id)
            if (args.length < 1) return client.reply(from, `Defina um prefixo!`, id)
            const nprefix = body.slice(11)
            prefix = nprefix
            await client.reply(from, `Prefixo alterado para ${prefix}`, id)
        break

		case 'randomhentai':
			if (isBanned) return client.reply(from, `Desculpe, você está banido deste bot...`, id)
			const hentai = await axios.get(`https://nekos.life/api/v2/img/hentai`)
			client.sendFileFromUrl(from, hentai.data.url, ``, `Punhetero >;c`, id)
		break

        case 'ltts':
        case 'menutts':
            if (isBanned) return client.reply(from, `Desculpe, você está banido deste bot...`, id)
            await client.reply(from, menuId.textTts(pushname, prefix), id)
        break

        case 'menuadmin':
        case 'menuadm':
        case 'admmenu':
        case 'adminmenu':
            if (isBanned) return client.reply(from, `Desculpe, você está banido deste bot...`, id)
            if (!isGroupMsg) return client.reply(from, 'Desculpe, este comando só pode ser usado em grupos.', id)
            if (!isGroupAdmins) return client.reply(from, 'Desculpe, este comando só pode ser usado por admins do grupo.', id)
            await client.sendText(from, menuId.textAdmin(pushname, prefix), id)
        break

        case 'creditos':
        case 'credito':
        case 'créditos':
        case 'crédito':
        case 'c':
        case 'copyright':
            if (isBanned) return client.reply(from, `Desculpe, você está banido deste bot...`, id)
            console.log('Oba! Alguem usou o comando credito!')
            client.reply(from, menuId.textCredito(pushname, prefix), id)
        break

        case 'bv':
        case 'bemvindo':
        case 'bemvinda':
        case 'b-v':
        case 'bem-vindo':
        case 'bem-vinda':
            if (isBanned) return client.reply(from, `Desculpe, você está banido deste bot...`, id)
            const bv = './media/bv.ogg'
            client.sendFile(from, bv)
        break

        case 'dolar':
        case 'dólar':
        case 'dollar':
        case 'usd':
        case 'valordolar':
        case 'dolarparareal':
        case 'dolarprareal':
        case 'dollarprareal':
        case 'dollarparareal':
            const adl = await axios.get(`http://api.currencylayer.com/live?access_key=900f77252f8d757fde220768469badfa&currencies=USD,BRL`)
            client.reply(from, `Valor dollar em real:\n\n💵 1.00 U$ 💵\n 💵 ` + adl.data.quotes.USDBRL + ` R$ 💵` , id)
        break

		case 'viih':
		case 'vih':
			if (isBanned) return client.reply(from, `Desculpe, você está banido deste bot...`, id)
			client.sendText(from, `- Você quer ver a vih?!`)
			client.sendText(from, `- D-Digo... o amor da minha vida? a pessoa mais especial do mundo???`)
			client.sendText(from, `Digite ${prefix}vih-sim ou ${prefix}vih-nao.`, id)
		break

		case 'vih-sim':
		case 'viih-sim':
			if (isBanned) return client.reply(from, `Desculpe, você está banido deste bot...`, id)
			const vihimage = './media/viih.jpg'
			client.reply(from, `OK,QUE COMEÇEMOS A INVOCAÇÃO`, id)
			client.sendText(from, `-  ➼⦓➼†ᴠɪᴛᴏʀɪᴀ†➼⦔➼,ᴀ ᴇᴍɪssᴀʀɪᴀ ᴅᴀ ✨ᴍᴀɢɴɪᴛᴜᴅᴇ✨ ᴇ ᴅᴀ ✨ᴘᴇʀғᴇɪᴄᴀᴏ✨ ✨ᴇᴛᴇʀɴᴀ✨`)
			client.sendText(from, `- ✡manifeste-se entre os mortais,⚝ó deusa da soberania⚝ apareça entre nois!✡`)
			client.sendText(from, `- ⍟🕯️vos chamo a nossa presença🕯️⍟`)
			client.sendText(from, `- !🌙†entre nós manifestesse†🌙!`)
			client.sendText(from, `- ✡[. . .]✡`)
			client.sendText(from, `- ✡[. . .]✡`)
			client.sendText(from, `- ✡[. . .]✡`)
			client.sendFile(from, vihimage)
		break

	    case 'viih-nao':
		case 'viih-não':
		case 'vih-nao':
		case 'vih-não':
			if (isBanned) return client.reply(from, `Desculpe, você está banido deste bot...`, id)
			client.reply(from, `- Ok! caia fora ⚝mortal⚝ Você não é digno de tanta beleza!`, id)
		break

        case 'covid19':
            if (isBanned) return client.reply(from, `Desculpe, você está banido deste bot...`, id)
            const pais = body.slice(9)
            const covid19 = await axios.get(`https://covid19-brazil-api.now.sh/api/report/v1/brazil/uf/` + pais)
            const covid19brazil = await axios.get(`https://covid19-brazil-api.now.sh/api/report/v1/brazil`)
            if (pais == '') {
                client.reply(from, `Lista de casos do covid-19 no ` + covid19brazil.data.data.country + `.\n\nCasos: ` + covid19brazil.data.data.cases + `\nConfirmados: ` + covid19brazil.data.data.confirmed + `\nMortes: ` + covid19brazil.data.data.deaths + `\nRecuperados: ` + covid19brazil.data.data.recovered + `\nLista atualizada em: ` + covid19brazil.data.data.updated_at + `\n\nCaso queira algum estado em específico digite ${prefix}covid19 (Sigla do estado ex: ${prefix}covid19 GO)`, id)
            } else {
                client.reply(from, `Lista de casos do covid-19 em ` + covid19.data.state + `/` + covid19.data.uf + `.\n\nCasos: ` + covid19.data.cases + `\nSuspeitos: ` + covid19.data.suspects + `\nMortes: ` + covid19.data.deaths + `\nCasos descartados: ` + covid19.data.refuses + `\nLista atualizada em: ` + covid19.data.datetime + `\n\nSe estiver aparecendo "Undefined" é porque você digitou a sigla do estado incorretamente.`, id)
            }
        break

        case 'fox':
        case 'fox-bot':
        case 'ia':
        case 'i.a':
        case 'foxia':
        case 'foxbot':
        case 'fox-ia':
        case 'iafox':
        case 'ia-fox':
        case 'i.a-fox':
        case 'fox-i.a':
			if (isBanned) return client.reply(from, `Desculpe, você está banido deste bot...`, id)
			try {
                const langfox = 'pt-br'
				const fox = await axios.get(`http://simsumi.herokuapp.com/api?text=${body.slice(5)}&lang=` + langfox + ``)
				if (fox.data.success == '') {
					console.log('Ops, algo deu errado.')
					let rndrl = fs.readFileSync('./config/reply.txt').toString().split('\n')
					let repl = rndrl[Math.floor(Math.random() * rndrl.length)]
					let resmf = repl.replace('%name$', `${name}`).replace('%battery%', `${lvpc}`)
					console.log(resmf)
					client.reply(from, resmf, id)
				} else {
					await client.reply(from, fox.data.success, id)
				}
			} catch (error) {
					console.log('Ops, algo deu errado.')
					let rndrl = fs.readFileSync('./config/reply.txt').toString().split('\n')
					let repl = rndrl[Math.floor(Math.random() * rndrl.length)]
					let resmf = repl.replace('%name$', `${name}`).replace('%battery%', `${lvpc}`)
					console.log(resmf)
					client.reply(from, resmf, id)
			}
		break
		
		case 'assinaturas':
        case 'assinatura':
            if (isBanned) return client.reply(from, `Desculpe, você está banido deste bot...`, id)
            const assinaturas = './media/assinaturas.jpg'
            client.reply(from, `Metodos de pagamento: PIX,PICPAY e MERCADO PAGO`, id)
            client.sendText(from, `envie mensagem para esse numero: wa.me/5516981627859`)
            client.sendText(from, `EM CASO DE DUVIDAS OU INTERESSE`)
            client.sendFile(from, assinaturas, '', '', id)
        break

		case 'oculto':
            if (!isGroupMsg) return client.reply(from, 'Apenas grupos!', id)
            const eur = await client.getGroupMembers(groupId)
            const surpresa = eur[Math.floor(Math.random() * eur.length)]
			console.log(surpresa.id)
    	    var xvid = ["Negoes branquelos e feministas", `${pushname} se depilando na banheira`, `${pushname} comendo meu cuzinho`, `${pushname} quer me comer o que fazer?`, "lolis nuas e safadas", "Ursinhos Mansos Peludos e excitados", "mae do adm cozida na pressao", "como bater punheta", "Como tocar siririca", "tentei comer a minha irmã e ela chamou a policia,oque eu faço?", "Buceta de 500 cm inflavel da boneca chinesa lolita company", "corno manso batendo uma pra mim com meu rosto na webcam", "tigresa vip da buceta de mel", "belle delphine dando o cuzinho no barzinho da esquina", "fazendo anal no negao", "africanos nus e chupando pau", "anal africano", "comendo a minha tia", "lgbts fazendo ahegao", "adm gostoso tirando a roupa", "gays puxando o intestino pra fora", "Gore de porno de cachorro", "anoes baixinhos do pau grandao", "Anões Gays Dotados Peludos", "anões gays dotados penetradores de botas", "Ursinhos Mansos Peludos", "Jailson Mendes", "Vendo meu Amigo Comer a Esposa", "Golden Shower"]
            const surpresa2 = xvid[Math.floor(Math.random() * xvid.length)]
            await client.sendTextWithMentions(from, `*EQUIPE ❌VIDEOS*\n\n_Caro usuário @${surpresa.id.replace(/@c.us/g, '')} ..._\n\n_Sou da administração do Xvideos e nós percebemos que você não entrou em sua conta por mais de 2 semanas e decidimos checar pra saber se está tudo OK com o(a) nosso(a) usuário(a) mais ativo(a)._ \n\n_Desde a última vez que você visitou nosso site, você procurou mais de centenas de vezes por_ *"${surpresa2}"* _(acreditamos ser sua favorita), viemos dizer que elas foram adicionadas e temos certeza que você irá gostar bastante._ \n_Esperamos você lá!_\n\n_Para o nosso usuário(a) favorito(a), com carinho, Equipe Xvideos._`)
            await sleep(2000)
        break

		case 'detector':
			await client.reply(from, 'Calculando foto dos participantes do grupo...', id)
            await sleep(3000)
            const eu = await client.getGroupMembers(groupId)
            const gostosa = eu[Math.floor(Math.random() * eu.length)]
			console.log(gostosa.id)
            await client.sendTextWithMentions(from, `*ＤＥＴＥＣＴＯＲ   ＤＥ  ＧＯＳＴＯＳＡＳ👩‍⚕️*\n\n*pi pi pi pi*  \n*pipipipi🚨🚨🚨pipipipi🚨🚨🚨pipipipi🚨🚨🚨pipi*\n\n@${gostosa.id.replace(/@c.us/g, '')} *PARADA(O) AÍ🖐*\n\n*VOCÊ ACABA DE RECEBER DUAS MULTAS*\n\n*1 por não dar bom dia,boa tarde,boa noite e outra por ser muito*\n\n*gostosa(o)*\n\n*valor da multa:*\n*FOTO DA TETINHA NO PV kkkkk*`)
            await sleep(2000)
        break

        case 'resposta':
            if (isBanned) return client.reply(from, `Desculpe, você está banido deste bot...`, id)
			if (args.length == 0) return client.reply(from, 'Faltou a frase para ser adicionada.', id)
			fs.appendFile('./config/reply.txt', `\n${body.slice(10)}`)
			await client.reply(from, 'Frase adicionada a I.A.', id)
		break

        case 'whatanime':
        case 'anime':
        case 'qualanime':
        case 'whoanime':
            if (isBanned) return client.reply(from, `Desculpe, você está banido deste bot...`, id)
            if (isMedia && type === 'image' || quotedMsg && quotedMsg.type === 'image') {
                if (isMedia) {
                    var mediaData = await decryptMedia(message, uaOverride)
                } else {
                    var mediaData = await decryptMedia(quotedMsg, uaOverride)
                }
                const fetch = require('node-fetch')
                const imgBS4 = `data:${mimetype};base64,${mediaData.toString('base64')}`
                client.reply(from, 'Procurando....', id)
                fetch('https://trace.moe/api/search', {
                    method: 'POST',
                    body: JSON.stringify({ image: imgBS4 }),
                    headers: { "Content-Type": "application/json" }
                })
                .then(respon => respon.json())
                .then(resolt => {
                	if (resolt.docs && resolt.docs.length <= 0) {
                		client.reply(from, 'Desculpe, não sei o que é este anime, certifique-se de que a imagem a ser pesquisada não está desfocada/cortada', id)
                	}
                    const { is_adult, title, title_chinese, title_romaji, title_english, episode, similarity, filename, at, tokenthumb, anilist_id } = resolt.docs[0]
                    teks = ''
                    if (similarity < 0.92) {
                    	teks = '*Talvez não seja esse o anime...* :\n\n'
                    }
                    teks += `➸ *Nome (Japonês)* : ${title}\n➸ *Nome (Inglês)* : ${title_english}\n`
                    teks += `➸ *NSFW?* : ${is_adult}\n`
                    teks += `➸ *Episódios* : ${episode.toString()}\n`
                    teks += `➸ *Semelhança* : ${(similarity * 100).toFixed(1)}%\n`
                    var video = `https://media.trace.moe/video/${anilist_id}/${encodeURIComponent(filename)}?t=${at}&token=${tokenthumb}`;
                    client.sendFileFromUrl(from, video, 'anime.mp4', teks, id).catch(() => {
                        client.reply(from, teks, id)
                    })
                })
                .catch(() => {
                    client.reply(from, 'Algo deu errado!', id)
                })
            } else {
				client.reply(from, `Desculpe, formato errado\n\nPor favor, envie uma foto com a legenda ${prefix}anime\n\nOu responda a foto com a legenda ${prefix}whatanime`, id)
			}
        break

        case 'speed':
        case 'ping':
            await client.reply(from, `Velocidade: ${processTime(t, moment())} *segundos*`, id)
        break

        case 'ship':
            if (isBanned) return client.reply(from, `Desculpe, você está banido deste bot...`, id)
                const casal1 = arg.split('&')[0]
                const casal2 = arg.split('&')[1]
                const random = (num) => Math.floor(Math.random() * num);
                const aleatorio = (random(100))
                if (args.length == 0) return client.reply(from, `Você está tentando shippar quem?\nDigite ${prefix}ship (pessoa n1) & (pessoa n2)\nex: ${prefix}ship Alana & Emanoel`, id)
                if (args.length == 1) return client.reply(from, `Você está tentando shippar quem?\nDigite ${prefix}ship (pessoa n1) & (pessoa n2)\nex: ${prefix}ship Alana & Emanoel`, id)
                if (args.length == 2) return client.reply(from, `Você está tentando shippar quem?\nDigite ${prefix}ship (pessoa n1) & (pessoa n2)\nex: ${prefix}ship Alana & Emanoel`, id)
                if (casal2 == '') return client.reply(from, `Você está tentando shippar quem?\nDigite ${prefix}ship (pessoa n1) & (pessoa n2)\nex: ${prefix}ship Alana & Emanoel`, id)
                if (args.length > 2) {
                    if (aleatorio === '100') {
                        await client.reply(from, `💞${casal1} & ${casal2}💞\nE o resultado é:\n${aleatorio}%\nOs dois foram feitos um para o outro!💖`, id)
                    } else if (aleatorio == '0') {
                        await client.reply(from, `💞${casal1} & ${casal2}💞\nE o resultado é:\n${aleatorio}%\nEstes dois não servem um para o outro.💔`, id)
                    } else if (aleatorio == '50') {
                        await client.reply(from, `💞${casal1} & ${casal2}💞\nE o resultado é:\n${aleatorio}%\nMeio a meio... 🥀`, id)
                    } else {
                        await client.reply(from, `💞${casal1} & ${casal2}💞\nE o resultado é:\n${aleatorio}%`, id)
                    }
                }
        break

        case 'morte':
		case 'death':
        case 'deathage':
        case 'anodemorte':
        case 'anomortal':
            if (isBanned) return client.reply(from, `Desculpe, você está banido deste bot...`, id)
            if (args.length == 0) return client.reply(from, 'Coloque um nome, apenas um, nada de sobrenome ou nomes inteiros, ainda mais por sua segurança!', id)
			const predea = await axios.get(`https://api.agify.io/?name=${args[0]}`)
			await client.reply(from, `Pessoas com este nome "${predea.data.name}" tendem a morrer aos ${predea.data.age} anos de idade.`, id)
		break

        case 'gender':
		case 'genero':
        case 'sexo':
            if (isBanned) return client.reply(from, `Desculpe, você está banido deste bot...`, id)
            if (args.length == 0) return client.reply(from, 'Coloque um nome, apenas um, nada de sobrenome ou nomes inteiros, ainda mais por sua segurança!', id)
			const seanl = await axios.get(`https://api.genderize.io/?name=${args[0]}`)
			const gender = seanl.data.gender.replace('female', 'mulheres').replace('male', 'homens')
			await client.reply(from, `O nome "${seanl.data.name}" é mais usado por ${gender}.`, id)
		break

        case 'gay':
            if (isBanned) return client.reply(from, `Desculpe, você está banido deste bot...`, id)
                const gayrandom = (num) => Math.floor(Math.random() * num);
                const gay = (gayrandom(100))
                if (gay === '100') {
                    await client.reply(from, `🌈-> *Gay-o-metter* <-🌈\n\nVocê é ${gay}% Gay!\n\nFilho do Pabllo Vittar 😏`, id)
                } else if (gay == '0') {
                    await client.reply(from, `🌈-> *Gay-o-metter* <-🌈\n\nVocê é ${gay}% Gay!\n\nHétero Top 😎👌`, id)
                } else if (gay == '25') {
                    await client.reply(from, `🌈-> *Gay-o-metter* <-🌈\n\nVocê é ${gay}% Gay!\n\nHétero `)
                } else if (gay == '50') {
                    await client.reply(from, `🌈-> *Gay-o-metter* <-🌈\n\nVocê é ${gay}% Gay!\n\n😐`, id)
                } else if (gay == '75') {
                    await client.reply(from, `🌈-> *Gay-o-metter* <-🌈\n\nVocê é ${gay}% Gay!\n\n Gay mestre 😋`, id)
                } else {
                    await client.reply(from, `🌈-> *Gay-o-metter* <-🌈\n\nVocê é ${gay}% Gay!`, id)
                }
        break

        case 'corno':
            if (isBanned) return client.reply(from, `Desculpe, você está banido deste bot...`, id)
                const cornorandom = (num) => Math.floor(Math.random() * num);
                const corno = (cornorandom(101))
                if (corno === '100') {
                    await client.reply(from, `🐂-> *Corno-o-metter* <-🐂\n\nVocê é ${corno}% Corno(a)!\n\nCorno(a) supremo(a) -(->x🐂x<-)-`, id)
                } else if (corno == '101') {
                    await client.reply(from, `🐂-> *Corno-o-metter* <-🐂\n\nVocê é SUPREME% Corno(a)!\n\nGADO MODO DEUS!`, id)
                } else if (corno == '0') {
                    await client.reply(from, `🐂-> *Corno-o-metter* <-🐂\n\nVocê é ${corno}% Corno(a)!\n\nNunca foi traido(a) 😎👌`, id)
                } else if (corno == '25') {
                    await client.reply(from, `🐂-> *Corno-o-metter* <-🐂\n\nVocê é ${corno}% Corno(a)!\n\nCorno(a) conformado(a)`)
                } else if (corno == '50') {
                    await client.reply(from, `🐂-> *Corno-o-metter* <-🐂\n\nVocê é ${corno}% Corno(a)!\n\n😐`, id)
                } else if (corno == '75') {
                    await client.reply(from, `🐂-> *Corno-o-metter* <-🐂\n\nVocê é ${corno}% Corno(a)!\n\nCorno(a) mestre(a) 🐂👌`, id)
                } else {
                    await client.reply(from, `🐂-> *Corno-o-metter* <-🐂\n\nVocê é ${corno}% Corno(a)!`, id)
                }
        break

		case 'perfil':
			if (!quotedMsg) {
				const peoXp = rank.getXp(user, nivel)
				const peoLevel = rank.getLevel(user, nivel)
				const ineedxp = 5 * Math.pow(peoLevel, 2) + 50 * peoLevel + 100
				var pic = await client.getProfilePicFromServer(author) 
				var namae = pushname
				var sts = await client.getStatus(author)
				var adm = isGroupAdmins ? 'Sim' : 'Não'
				const { status } = sts
				if (pic == undefined) {
					var pfp = errorurl 
				} else {
					var pfp = pic
				} 
				await client.sendFileFromUrl(from, pfp, 'pfo.jpg', `*Dados do seu perfil..* ✨️ \n\n 🔖️ *Nome de usuário:*\n${namae}\n\n👑️ *Administrador?*\n${adm}\n\n💌️ *Recado:*\n${status}`)
			} else if (quotedMsg) {
				var qmid = quotedMsgObj.sender.id
				var namae = quotedMsgObj.sender.pushname
				var pic = await client.getProfilePicFromServer(qmid)
				var sts = await client.getStatus(qmid)
				var adm = groupAdmins.includes(qmid) ? 'Sim' : 'Não'
				const peoXp = rank.getXp(qmid, nivel)
				const peoLevel = rank.getLevel(qmid, nivel)
				const ineedxp = 5 * Math.pow(peoLevel, 2) + 50 * peoLevel + 100
				const { status } = sts
				if (pic == undefined) {
					var pfp = errorurl 
				} else {
					var pfp = pic
				}
                await client.sendFileFromUrl(from, pfp, 'pfo.jpg', `*Dados do seu perfil..* ✨️ \n\n 🔖️ *Nome de usuário:*\n${namae}\n\n👑️ *Administrador?*\n${adm}\n\n💌️ *Recado:*\n${status}`)
			} else {
				client.reply(from, `Ops! Algo deu errado...`, id)
			}
			
		case 'attp':
			if (isBanned) return client.reply(from, `Desculpe, você está banido deste bot...`, id)
			if (args.length < 1) client.reply(from, `Digite algum texto!`, id)
			const attptxt = body.slice(6)
			const urlattp = `https://api.xteam.xyz/attp?file&text=${attptxt}`
			await client.sendMp4AsSticker(from, urlattp, { fps: 20, startTime: '00:00:00.0', endTime : '00:00:5.0', loop: 0 })
				.then(async () => {
                    console.log(`Sticker processed for ${processTime(t, moment())} seconds`)
                })
		break

        case 'fofo':
            if (isBanned) return client.reply(from, `Desculpe, você está banido deste bot...`, id)
                const foforandom = (num) => Math.floor(Math.random() * num);
                const fofo = (foforandom(100))
                if (fofo === '100') {
                    await client.reply(from, `🌟-> *Fofo-o-metter* <-🌟\n\nVocê é ${fofo}% Fofo(a)!\n\nSUPER FOFO(A)! 🌟🌟🌟🌟🌟`, id)
                } else if (fofo == '0') {
                    await client.reply(from, `🌟-> *Fofo-o-metter* <-🌟\n\nVocê é ${fofo}% Fofo(a)!\n\nAssustador(a)... 🌟`, id)
                } else if (fofo == '25') {
                    await client.reply(from, `🌟-> *Fofo-o-metter* <-🌟\n\nVocê é ${fofo}% Fofo(a)!\n\nFofinho(a) 🌟🌟;^;`)
                } else if (fofo == '50') {
                    await client.reply(from, `🌟-> *Fofo-o-metter* <-🌟\n\nVocê é ${fofo}% Fofo(a)!\n\nFofo(a) 🌟🌟🌟`, id)
                } else if (fofo == '75') {
                    await client.reply(from, `🌟-> *Fofo-o-metter* <-🌟\n\nVocê é ${fofo}% Fofo(a)!\n\nMuito fofo(a) 🌟🌟🌟🌟`, id)
                } else {
                    await client.reply(from, `🌟-> *Fofo-o-metter* <-🌟\n\nVocê é ${fofo}% Fofo(a)!`, id)
                }
        break
		
		case 'dybala':
            if (isBanned) return client.reply(from, `Desculpe, você está banido deste bot...`, id)
		        const dybala1 = './media/dybala1.jpg'
                const dybala2 = './media/dybala2.jpg'		  
		     client.reply(from, '- você está invocando a consciência e a presença de um deus.', id)
             client.sendText(from, '- ou melhor eu ouso dizer,você está invocando o próprio DEUS! um deus até mesmo entre os DEUSES!')
		     client.sendText(from, '- então começaremos a invocação do ser supremo †⚝➼⦓➼†DYBALINHA†➼⦔➼⚝† DEUS DA PIROQUINHA ⍟🕯️')
			 client.sendFile(from, dybala1)
			 client.sendFile(from, dybala2)
			 client.sendPtt(from, './media/dybalau.mp3', '', '', id)
			 
	    break
		
        case 'bonito':
            if (isBanned) return client.reply(from, `Desculpe, você está banido deste bot...`, id)
                const bonitorandom = (num) => Math.floor(Math.random() * num);
                const bonito = (bonitorandom(100))
                if (bonito === '100') {
                    await client.reply(from, `🌟-> *Bonito-o-metter* <-🌟\n\nVocê é ${bonito}% Bonito(a)!\n\nSUPER LINDO(A)! 🌟🌟🌟🌟🌟`, id)
                } else if (bonito == '0') {
                    await client.reply(from, `🌟-> *Bonito-o-metter* <-🌟\n\nVocê é ${bonito}% Bonito(a)!\n\nAssustador(a)... 🌟`, id)
                } else if (bonito == '25') {
                    await client.reply(from, `🌟-> *Bonito-o-metter* <-🌟\n\nVocê é ${bonito}% Bonito(a)!\n\nLindinho(a) 🌟🌟;^;`)
                } else if (bonito == '50') {
                    await client.reply(from, `🌟-> *Bonito-o-metter* <-🌟\n\nVocê é ${bonito}% Bonito(a)!\n\nBelinho(a) 🌟🌟🌟`, id)
                } else if (bonito == '75') {
                    await client.reply(from, `🌟-> *Bonito-o-metter* <-🌟\n\nVocê é ${bonito}% Bonito(a)!\n\nMuito Lindo(a) 🌟🌟🌟🌟`, id)
                } else {
                    await client.reply(from, `🌟-> *Bonito-o-metter* <-🌟\n\nVocê é ${bonito}% Bonito(a)!`, id)
                }
        break
		
        case 'randomanime':
            if (isBanned) return client.reply(from, `Desculpe, você está banido deste bot...`, id)
            const  nime2  =  await  randomNimek ( 'anime' )
            await  client.sendFileFromUrl (from,  nime2,  ``, 'Ui Ui ...', id)
        break

        case 'dado':
            if (isBanned) return client.reply(from, `Desculpe, você está banido deste bot...`, id)
                const numero = body.slice(6)
                if (args.length == 0) return client.reply(from, `Ehh... Voce digitou algum numero?`, id)
                const dado = (num) => Math.floor(Math.random() * num) + 1
                const dadoout = (dado(numero))
                client.reply(from, `Um dado de ${numero} lado(s) girou e caiu em...\n\n🎲-[ ${dadoout} ]-🎲`, id)
        break

        case 'flip':
            if (isBanned) return client.reply(from, `Desculpe, você está banido deste bot...`, id)
            const moeda = Math.floor(Math.random() * 2) + 1
            if (moeda == 1) {
               client.reply(from, `CARA!`, id)
               client.sendStickerfromUrl(from, 'https://i.ibb.co/LJjkVK5/heads.png')
            } else {
               client.reply(from, `COROA!`, id)
               client.sendStickerfromUrl(from, 'https://i.ibb.co/wNnZ4QD/tails.png')
            }
            break

        case 'tts':
        case 'texttospeech':
        case 'fala':
        case 'falar':
        case 'speak':
            if (isBanned) return client.reply(from, `Desculpe, você está banido deste bot...`, id)
            if (args.length == 3) return client.reply(from, `Formato incorreto. Digite ${prefix}tts (sigla de linguagem) (sua menssagem).\nLista de linguas podem ser encontradas neste site:\nhttps://anotepad.com/note/read/5xqahdy8`)
            const ttsGB = require('node-gtts')(args[0])
            const dataText = body.slice(8)
                if (dataText === '') return client.reply(from, 'Uso incorreto. Digite !tts (sigla de linguagem ex: pt) (sua menssagem)', id)
                try {
                    ttsGB.save('./media/tts.mp3', dataText, function () {
                    client.sendPtt(from, './media/tts.mp3', id)
                    })
                } catch (err) {
                    console.error(err)
                    client.reply(from, err, id)
                }
            break

// Emergency Sticker
/*
        case 'sticker':
        case 'stiker':
        case 's':
        case 'stk': {
            if (isBanned) return client.reply(from, `Desculpe, você está banido deste bot...`, id)
            if ((isMedia || isQuotedImage) && args.length === 0) {
                const encryptMedia = isQuotedImage ? quotedMsg : message
                const _mimetype = isQuotedImage ? quotedMsg.mimetype : mimetype
                const mediaData = await decryptMedia(encryptMedia, uaOverride)
                const imageBase64 = `data:${_mimetype};base64,${mediaData.toString('base64')}`
                client.reply(from, 'Processando figurinha...', id)
                client.sendImageAsSticker(from, imageBase64).then(() => {
                    console.log(`Sticker Processed for ${processTime(t, moment())} Second`)
                })
            } else if (args[0] === 'nobg') {
                client.reply(from, 'ehhh, o que é isso???', id)
            } else if (args.length === 1) {
                if (!is.Url(url)) { await client.reply(from, 'Desculpe, o link que você enviou é inválido.', id) }
                client.sendStickerfromUrl(from, url).then((r) => (!r && r !== undefined)
                    ? client.reply(from, 'Desculpe, o link que você enviou não contém uma imagem.', id)
                    : client.reply(from, '', id)).then(() => console.log(`Sticker Processed for ${processTime(t, moment())} Second`))
            } else {
                await client.reply(from, 'Formato errado marque uma imagem com !sticker ou coloque na legenda de uma imagem.', id)
            }
            break
        }
*/
        case 'stickernobg':
        case 'nobg':
        case 'nobackground':
        case 'nobgsticker':
        case 'nobgstk':
        case 'nobackgroundstk':
        case 'stknobg':
            if (!ispremium) return client.reply(from, `Desculpe, você não é um usuário premium.`)
			if (isMedia) {
                try {
                    var mediaData = await decryptMedia(message, uaOverride)
                    var imageBase64 = `data:${mimetype};base64,${mediaData.toString('base64')}`
                    var base64img = imageBase64
                    var outFile = './media/noBg.png'
                    var result = await removeBackgroundFromImageBase64({ base64img, apiKey: 'XQCEK1cvchs4JGUTxi3Z9myW', size: 'auto', type: 'auto', outFile })
                    await fs.writeFile(outFile, result.base64img)
                    await client.sendImageAsSticker(from, `data:${mimetype};base64,${result.base64img}`)
					await client.reply(from, 'Certifique-se de evitar usar isso quando não precisar.', id)
                } catch(err) {
                    console.log(err)
					await client.reply(from, 'Alguma coisa deu errado tente novamente mais tarde.', id)
                }
            }
        break


        case 'dn':
            if (isBanned) return client.reply(from, `Desculpe, você está banido deste bot...`, id)
            if (args.length == 0) return client.reply(from, `Você precisa inserir uma frase após o comando.`, id)
            const nulisq = body.slice(4)
            const nulisp = await tulis(nulisq)
            await client.sendImage(from, `${nulisp}`, '', '', id)
            .catch(() => {
                client.reply(from, 'Que peninha, a imagem não quis enviar ou o servidor negou o acesso...', id)
            })
        break

// Emergency Gifsticker
/*
        case 'stikergif':
        case 'gifsticker':
        case 'stickergif':
        case 'gifstk':
        case 'stkgif':
        case 'gifstiker':
        case 'g':
            if (isBanned) return client.reply(from, `Desculpe, você está banido deste bot...`, id)
            if (isMedia && type === 'video' || mimetype === 'image/gif' || isQuotedVideo || isQuotedGif) {
                    try {
                        const encryptMedia = isQuotedGif || isQuotedVideo ? quotedMsg : message
                        const mediaData = await decryptMedia(encryptMedia, uaOverride)
                        const videoBase64 = `data:${mimetype};base64,${mediaData.toString('base64')}`
                        await client.reply(from, `${pushname} estou fazendo sua figurinha animada ;)`, )
                        await client.sendMp4AsSticker(from, videoBase64, { fps: 25, startTime: '00:00:00.0', endTime : '00:00:10.0', loop: 0 })
                            .then(async () => {
                                console.log(`Sticker processed for ${processTime(t, moment())} seconds`)
                            })
                    } catch (err) {
                        console.error(err)
                        await client.reply(from, `Enviar GIF com no maximo 10 segundos e menos de 1MB`, id)
                    }
                } else {
                    await client.reply(from, `Enviar GIF com legenda !gifsticker`, id)
                }
            break
*/

        case 's':
        case 'sticker':
        case 'stiker':
        case 'stk':
        case 'g':
        case 'sg':
        case 'gs':
        case 'stickergif':
        case 'stikergif':
        case 'gifsticker':
        case 'gifstk':
        case 'stkgif':
        case 'gifstiker':
            if (isBanned) return client.reply(from, `Desculpe, você está banido deste bot...`, id)

            if ((isMedia && type === 'image' || mimetype === 'image' || isQuotedImage)) {
                const encryptMedia = isQuotedImage ? quotedMsg : message
                const _mimetype = isQuotedImage ? quotedMsg.mimetype : mimetype
                const mediaData = await decryptMedia(encryptMedia, uaOverride)
                const imageBase64 = `data:${_mimetype};base64,${mediaData.toString('base64')}`
                client.reply(from, 'Processando figurinha...', id)
                client.sendImageAsSticker(from, imageBase64).then(() => {
                    console.log(`Sticker Processed for ${processTime(t, moment())} Second`)
                    client.reply(from, `Figurinha criada com sucesso! (Caso não tenha sido criada verifique se o tamanho da imagem usada não ultrapassa os 1mb)`, id)
                })
            }

            if (isMedia && type === 'video' || mimetype === 'video/gif' || isQuotedVideo || isQuotedGif) {
                try {
                    const encryptMedia = isQuotedGif || isQuotedVideo ? quotedMsg : message
                    const mediaData = await decryptMedia(encryptMedia, uaOverride)
                    const videoBase64 = `data:${mimetype};base64,${mediaData.toString('base64')}`
                    await client.reply(from, `Processando figurinha animada...`, id)
                    await client.sendMp4AsSticker(from, videoBase64, { fps: 30, startTime: '00:00:00.0', endTime : '00:00:10.0', loop: 0 })
                        .then(async () => {
                            console.log(`Sticker processed for ${processTime(t, moment())} seconds`)
                            client.reply(from, `Figurinha animada criada com sucesso!`, id)
                        })
                } catch (err) {
                    console.error(err)
                    client.reply(from, `Ops! Alguma coisa deu errado, verifique se o video não pesa mais de 1mb e se ele tem no máximo 10s`, id)
                }
            } else {

            }
        break
            
        case 'upimg':
			if (isBanned) return client.reply(from, `Desculpe, você está banido deste bot...`, id)
            if (isMedia && type === 'image' || isQuotedImage) {
                const upimgoh = isQuotedImage ? quotedMsg : message
                const mediaData = await decryptMedia(upimgoh, uaOverride)
                var uplimg = './media/imageupl.jpg'
                await fs.writeFile(uplimg, mediaData)
				let options = {
					apiKey: config.imgbb,
					imagePath: './media/imageupl.jpg',
					expiration: 604800
				}
				const sdimg = await imgbbUploader(options)
				console.log(sdimg.url_viewer)
				await client.reply(from, `Link gerado com sucesso\n\n*OBS:* Este link tem duração de 7 dias, após isso a imagem será automaticamente deletada do servidor.\n\n-> ${sdimg.url_viewer} <-`, id)
			} else {
				await client.reply(from, 'Amigo(a), isso somente funciona com imagens.', id)
			}
		break

        case 'ttp':
			if (isBanned) return client.reply(from, `Desculpe, você está banido deste bot...`, id)
			if (args.length == 0) return client.reply(from, 'Cadê a frase né?', id)
			axios.get(`https://st4rz.herokuapp.com/api/ttp?kata=${body.slice(5)}`)
			.then(res => {
				client.sendImageAsSticker(from, res.data.result)
			})
		break

        case 'macaco':
        case 'mamaco':
        case 'monkey':
            if (isBanned) return client.reply(from, `Desculpe, você está banido deste bot...`, id)
			var item = ["macaco", "gorila", "chimpanzé", "orangotango", "babuino"]
    	    var esco = item[Math.floor(Math.random() * item.length)]
			console.log(esco)
			var maca = "https://api.fdci.se/sosmed/rep.php?gambar=" + esco
			axios.get(maca)
			    .then((result) => {
				var mon = JSON.parse(JSON.stringify(result.data))
				var nkey = mon[Math.floor(Math.random() * mon.length)]
              	client.sendFileFromUrl(from, nkey, "", "Mamaco :)", id)
			})
	    break

        case 'stikertoimg':
	    case 'stickertoimg':
    	case 'stimg':
        case 'toimg':
                if (isBanned) return client.reply(from, `Desculpe, você está banido deste bot...`, id)
                if (quotedMsg && quotedMsg.type == 'sticker') {
                    const mediaData = await decryptMedia(quotedMsg)
//                    client.reply(from, `Sedang di proses! Silahkan tunggu sebentar...`, id)
                    const imageBase64 = `data:${quotedMsg.mimetype};base64,${mediaData.toString('base64')}`
                    await client.sendFile(from, imageBase64, 'imgsticker.jpg', 'Aqui está sua imagem ;)', id)
                    .then(() => {
                        console.log(`Sticker to Image Processed for ${processTime(t, moment())} Seconds`)
                    })
            } else if (!quotedMsg) return client.reply(from, `Uso incorreto, marque um sticker que deseja transformar em imagem!`, id)
            break

        case 'grouplink':
            if (isBanned) return client.reply(from, `Desculpe, você está banido deste bot...`, id)
            if (!isBotGroupAdmins) return client.reply(from, 'O bot deve ser admin para executar o comando.', id)
            if (isGroupMsg) {
                const inviteLink = await client.getGroupInviteLink(groupId);
                client.sendLinkWithAutoPreview(from, inviteLink, `-\nLink de convite de: *${name}*. `)
            } else {
            	client.reply(from, 'Desculpe, este comando só pode ser usado em grupos.', id)
            }
            break
			
			 case 'batata':
            if (isBanned) return client.reply(from, `Desculpe, você está banido deste bot...`, id)
            const batata = './media/batataimg.jpg'
            client.reply(from, `OPA OPA OPA Ó A BATATINHAAA`, id)
            client.sendText(from, `CHIPS SÓ 2 REAL CADA,COMPRA AI PRA FORTALECER`, id)
            client.sendFile(from, batata)
        break
			
        case 'reginaldo':
            if (isBanned) return client.reply(from, `Desculpe, você está banido deste bot...`, id)
            const reginaldo = './media/reginaldo.jpeg'
            client.reply(from, `Iniciando invocação do Reginaldo...`, id)
            client.sendText(from, `REGINALDO É O CARA MAIS BRABO QUE EXISTE.`, id)
            client.sendText(from, `REGINALDO É O CARA MAIS BRABO QUE EXISTE.`, id)
            client.sendText(from, `REGINALDO É O CARA MAIS BRABO QUE EXISTE.`, id)
            client.sendFile(from, reginaldo)
        break

/*
        case 'stickergif':
        case 'gifsticker':
        case 'gifstk':
        case 'gif':
		case 'gifs':
            if (isMedia && type === 'video' || mimetype === 'image/gif' || isQuotedVideo || isQuotedGif) {
                await client.reply(from, `Processando Sticker.`, id)
                try {
                    const encryptMedia = isQuotedGif || isQuotedVideo ? quotedMsg : message
                    const mediaData = await decryptMedia(encryptMedia, uaOverride)
                    const gifSticker = `data:${mimetype};base64,${mediaData.toString('base64')}`
                    await client.sendMp4AsSticker(from, gifSticker, { fps: 30, startTime: '00:00:00.0', endTime : '00:00:10.0', loop: 0 })
                } catch (err) {
                    console.error(err)
                    await client.reply(from, 'Esse sticker obteve erros, é provavel que seja o seu peso, o maximo é de 1MB.', id)
                }
            } else {
                await client.reply(from, 'Isso pode ser usado somente com videos e gifs.', id)
            }
            break
*/

        case 'placa':
        case 'puxarplaca':
        case 'puxardadosplaca':
        case 'puxarcarro':
        case 'sign':
            if (isBanned) return client.reply(from, `Desculpe, você está banido deste bot...`, id)
            if (!ispremium) return client.reply(from, `Desculpe, você não é um usuário premium.`)
			if (args.length == 0) return client.reply(from, 'Coloque uma placa para puxar.', id)
			if (!isGroupMsg) return client.reply(from, mess.error.Gp, id)
			sinesp.search(`${args[0]}`).then(async (dados) => {
				await client.reply(from, `═✪〘 Placa puxada (${dados.placa}) 〙✪═\n\n*Situação:* ${dados.situacao}\n*Modelo:* ${dados.modelo}\n*Marca:* ${dados.marca}\n*Cor:* ${dados.cor}\n*Ano:* ${dados.ano}\n*Ano do modelo:* ${dados.anoModelo}\n*Estado:* ${dados.uf}\n*Municipio:* ${dados.municipio}\n*Chassi:* ${dados.chassi}.`, id)
			}).catch(async (err) => {
				console.log(err);
				await client.reply(from, 'Placa não encontrada.', id)
			})
		break

        case 'mp3':
            if (isBanned) return client.reply(from, `Desculpe, você está banido deste bot...`, id)
            if (args.length == 0) return client.reply(from, `Erro, digite ${prefix}mp3 (link)`, id)
            axios.get(`http://st4rz.herokuapp.com/api/yta2?url=${body.slice(5)}`)
            .then(async(rest) => {
					var m3pa = rest.data.result
					var m3ti = rest.data.title
					var m3tu = rest.data.thumb
					var m3fo = rest.data.ext
//					await client.sendFileFromUrl(from, m3tu, '', `Titulo: ${m3ti}\nFormato:${m3fo}\n\nEnviando áudio....`, id)
                    await client.sendText(from, `Link de download do audio: ${mp3pa}`)
                    await client.sendFileFromUrl(from, m3pa, '', '', id)
                })
		break

        case 'play':
            if (isBanned) return client.reply(from, `Desculpe, você está banido deste bot...`, id)
            const playout = await axios.get(`https://arugaytdl.herokuapp.com/search?q=${body.slice(6)}`)
            const playid = playout.data[0].id
            const playtitle = playout.data[0].title
            if (playout.data[0].duration >= 900) return client.reply(from, 'Desculpe mas o video não pode ter mais de 15 minutos!', id)
            var saidatime = playout.data[0].duration / 60
            const views = playout.data[0].viewCount
            client.reply(from, `Baixando audio\n\nNome: ${playtitle}\nDuração: ${saidatime}min\nVisualizações: ${views}`, id)
            const playfinal = await axios.get(`http://st4rz.herokuapp.com/api/yta2?url=https://youtu.be/${playid}`)
            await client.sendFileFromUrl(from, playfinal.data.result, '', '', id)
        break


        case 'presente':
        case 'gift':
        case 'presentedeaniversario':
            if (isBanned) return client.reply(from, `Desculpe, você está banido deste bot...`, id)
            const rgift = fs.readFileSync('./config/gift.txt').toString().split('\n')
            const rgidd = rgift[Math.floor(Math.random() * rgift.length)]
            await client.reply(from, `${pushname} você irá ganhar ` + rgidd + ` de aniversário!\nParabéns ^^`, id)
        break

        case 'curiosidade':
        case 'curiosidades':
            if (isBanned) return client.reply(from, `Desculpe, você está banido deste bot...`, id)
			const rcurio = fs.readFileSync('./config/curiosidades.txt').toString().split('\n')
			const rsidd = rcurio[Math.floor(Math.random() * rcurio.length)]
			await client.reply(from, rsidd, id)
		break

        case 'mp4':
            if (isBanned) return client.reply(from, `Desculpe, você está banido deste bot...`, id)
            if (args.length == 0) return client.reply(from, `Erro, digite ${prefix}mp4 (link).`, id)
            axios.get(`http://st4rz.herokuapp.com/api/ytv2?url=${body.slice(5)}`)
            .then(async(rest) => {
					var mp4 = rest.data.result
					var tmp4 = rest.data.title
					var m4tu = rest.data.thumb
					var m4fo = rest.data.ext
//					await client.sendFileFromUrl(from, m4tu, '', `Titulo: ${tmp4}\nFormato:${m4fo}\n\nEnviando video....`, id)
                    await client.sendText(from, `Link de download do video: ${mp4}`)
					await client.sendFileFromUrl(from, mp4, `video.mp4`, tmp4, id)
                })
		break

        case 'ip':
			if (isBanned) return client.reply(from, `Desculpe, você está banido deste bot...`, id)
			if (args.length == 1) {
				const ip = await axios.get(`http://ipwhois.app/json/${body.slice(5)}`)
				await client.reply(from, `http://www.google.com/maps/place/${ip.data.latitude},${ip.data.longitude}\n✪ IP: ${ip.data.ip}\n\n✪ Tipo: ${ip.data.type}\n\n✪ Região: ${ip.data.region}\n\n✪ Cidade: ${ip.data.city}\n\n✪ Latitude: ${ip.data.latitude}\n\n✪ Longitude: ${ip.data.longitude}\n\n✪ Provedor: ${ip.data.isp}\n\n✪ Continente: ${ip.data.continent}\n\n✪ Sigla do continente: ${ip.data.continent_code}\n\n✪ País: ${ip.data.country}\n\n✪ Sigla do País: ${ip.data.country_code}\n\n✪ Capital do País: ${ip.data.country_capital}\n\n✪ DDI: ${ip.data.country_phone}\n\n✪ Países Vizinhos: ${ip.data.country_neighbours}\n\n✪ Fuso Horário: ${ip.data.timezone} ${ip.data.timezone_name} ${ip.data.timezone_gmt}\n\n✪ Moeda: ${ip.data.currency}\n\n✪ Sigla da Moeda: ${ip.data.currency_code}\n\n-=Busca de IP realizada por FOX-BOT=-`, id)
            } else {
				await client.reply(from, 'Especifique um IP de tipo IPV4.', id)
            }
		break

        case 'cep':
			if (isBanned) return client.reply(from, `Desculpe, você está banido deste bot...`, id)
			if (args.length == 1) {
				const cep = await axios.get(`https://viacep.com.br/ws/${body.slice(6)}/json/`)
				await client.reply(from, `✪ CEP: ${cep.data.cep}\n\n✪ Logradouro: ${cep.data.logradouro}\n\n✪ Complemento: ${cep.data.complemento}\n\n✪ Bairro: ${cep.data.bairro}\n\n✪ Estado: ${cep.data.localidade}\n\n✪ DDD: ${cep.data.ddd}\n\n✪ Sigla do Estado: ${cep.data.uf}\n\n✪ Código IBGE: ${cep.data.ibge}\n\n✪ Código GIA: ${cep.data.gia}\n\n✪ Código Siafi: ${cep.data.siafi}.`, id)
            } else {
				await client.reply(from, 'Especifique um CEP.', id)
            }
		break

        case 'meme':
        case 'legenda':
        case 'cc':
            if (isBanned) return client.reply(from, `Desculpe, você está banido deste bot...`, id)
            if ((isMedia || isQuotedImage) && args.length >= 2) {
                const top = arg.split('|')[0]
                const bottom = arg.split('|')[1]
                const encryptMedia = isQuotedImage ? quotedMsg : message
                const mediaData = await decryptMedia(encryptMedia, uaOverride)
                const getUrl = await uploadImages(mediaData, false)
                const ImageBase64 = await meme.custom(getUrl, top, bottom)
                client.sendFile(from, ImageBase64, 'image.png', '', null, true)
                    .then((serialized) => console.log(`Sukses Mengirim File dengan id: ${serialized} diproses selama ${processTime(t, moment())}`))
                    .catch((err) => console.error(err))
            } else {
                await client.reply(from, 'Falta uma imagem! Por favor marque uma imagem com o comando ou envie uma imagem com o comando como legenda.', id)
            }
            break

        case 'wasted':
            if (isBanned) return client.reply(from, `Desculpe, você está banido deste bot...`, id)
            if (isMedia && type === 'image' || isQuotedImage) {
                const wastedmd = isQuotedImage ? quotedMsg : message
                const wstddt = await decryptMedia(wastedmd, uaOverride)
                await client.reply(from, `Processando imagem...`, id)
				const options = {
					apiKey: config.imgbb,
					imagePath: './media/wasted.jpg',
					expiration: 1800
				}
                var wstdimg = './media/wasted.jpg'
                await fs.writeFile(wstdimg, wstddt)
				const wasteup = await imgbbUploader(options)
				console.log(wasteup.url)
                await client.sendFileFromUrl(from, `https://some-random-api.ml/canvas/wasted?avatar=${wasteup.url}`, 'Wasted.jpg', 'Alguém viu essa pessoa por aqui?', id)
            } else {
                await client.reply(from, 'Isto não é uma imagem...', id)
            }
        break

        case 'msg':
        case 'message':
        case 'mensagem':
        case 'pv':
            if (isBanned) return client.reply(from, `Desculpe, você está banido deste bot...`, id)
            if (args.length >= 2) {
                var text = arg.split('| ')[1]
                if (text == '') return client.reply(from, `Uso incorreto... Utilize ${prefix}msg @MençãoDeNumero | Mensagem.`)
                client.sendText(mentionedJidList[0], `[Mensagem de ${pushname}]\n----------\n${text}`)
                console.log(color('Mensagem enviada!', 'lime'))
                client.reply(from, `[Mensagem enviada com sucesso]`, id)
            } else {
                await client.reply(from, `Uso incorreto... Utilize ${prefix}msg @menção | mensagem`, id)
            }
        break

        case 'report':
            if (isBanned) return client.reply(from, `Desculpe, você está banido deste bot...`, id)
            if (args.length >= 1) {
                client.sendText(owner + '@c.us', `[Report de ${pushname}]\n\n----------\n${body.slice(8)}`)
                console.log(color('Report enviado...', 'lime'))
                client.reply(from, `[Report enviado com sucesso]`, id)
            } else {
                await client.reply(from, `Uso incorreto... Utilize ${prefix}report (mensagem)`, id)
            }
        break

        case 'raposa':
            if (isBanned) return client.reply(from, `Desculpe, você está banido deste bot...`, id)
            const raposa = await axios.get(`https://some-random-api.ml/img/fox`)
			await client.sendFileFromUrl(from, raposa.data.link, ``, 'Olha este sou eu <3', id)
			break

        case 'hug':
        case 'abraço':
        case 'abraco':
        case 'abracar':
        case 'abraçar':
            if (double == 1) {
                const hug1 = await axios.get(`https://nekos.life/api/v2/img/hug`)
                await client.sendFileFromUrl(from, hug1.data.url, ``, `Abraço fofinho...`, id)
            } else if (double == 2) {
                const hug = await randomNimek('hug')
                await client.sendFileFromUrl(from, hug, ``, '<3', id)
			}
		break

        case 'waifu':
            if (isBanned) return client.reply(from, `Desculpe, você está banido deste bot...`, id)
            w2 = Math.floor(Math.random() * 100) + 10;
            client.sendFileFromUrl(from, 'http://randomwaifu.altervista.org/images/00'+w2+'.png', id) 
        break

        case 'loli':
            if (isBanned) return client.reply(from, `Desculpe, você está banido deste bot...`, id)
			const onefive = Math.floor(Math.random() * 145) + 1
			client.sendFileFromUrl(from, `https://media.publit.io/file/Twintails/${onefive}.jpg`, 'loli.jpg', 'FBI!!!!', id)
        break

        case 'waifustk':
        case 'waifusticker':
        case 'stickerwaifu': 
            if (isBanned) return client.reply(from, `Desculpe, você está banido deste bot...`, id)
            w2 = Math.floor(Math.random() * 100) + 10;
            client.sendStickerfromUrl(from, 'http://randomwaifu.altervista.org/images/00'+w2+'.png', id) 
        break

/*
        case 'hug':
        case 'abraco':
        case 'abraço':
            const hug = await axios.get(`https://nekos.life/api/hug`)
            await client.sendFileFromUrl(from, hug.data.url, ``, `Abraço fofinho... ^-^`, id)
		break

        case 'feed':
        case 'alimentar':
            const feed = await axios.get(`https://nekos.life/api/v2/img/feed`)
                await client.sendFileFromUrl(from, feed.data.url, ``, `Nhom Nhom delicia... ;~;`, id)
		break
*/
        case 'saycat':
            if (isBanned) return client.reply(from, `Desculpe, você está banido deste bot...`, id)
            var saycat = "https://api.fdci.se/sosmed/rep.php?gambar=saycat"
            axios.get(saycat)
            	.then((result) => {
				    var b = JSON.parse(JSON.stringify(result.data));
				    var cewek =  b[Math.floor(Math.random() * b.length)];
              	    client.sendFileFromUrl(from, cewek, "result.jpg", "Ent vc gosta da saycat? 0.0", id)
		        })
        break

        case 'neko':
        case 'neko1':
            if (isBanned) return client.reply(from, `Desculpe, você está banido deste bot...`, id)
			const neko1 = await axios.get(`https://nekos.life/api/v2/img/kemonomimi`)
			await client.sendFileFromUrl(from, neko1.data.url, ``, `Nekoooo chann`, id)
        break

        case 'neko2':
            if (isBanned) return client.reply(from, `Desculpe, você está banido deste bot...`, id)
            nekol = Math.floor(Math.random() * 2) + 1
            if (nekol == 1) {
                const neko1 = await axios.get(`https://nekos.life/api/v2/img/fox_girl`)
				await client.sendFileFromUrl(from, neko1.data.url, ``, `Nekooo`, id)
            } else if (nekol == 2) {
				const neko2 = await axios.get(`https://nekos.life/api/v2/img/neko`)
				await client.sendFileFromUrl(from, neko2.data.url, ``, `Nekooo`, id)
            }
        break

        case 'wallpaper':
        case 'animewallpaper':
        case 'randomwallpaper':
            if (isBanned) return client.reply(from, `Desculpe, você está banido deste bot...`, id)
            const wallpaper = await axios.get(`https://nekos.life/api/v2/img/wallpaper`)
            console.log('Gerando wallpaper')
            await client.reply(from, `Gerando wallpaper de anime...`, id)
            await client.sendFileFromUrl(from, wallpaper.data.url, ``, `Aqui está seu wallpaper :)`, id)
        break

        case 'perfilimg':
        case 'nekoperfil':
        case 'nekoprofile':
        case 'perfilneko':
        case 'imgperfil':
        case 'profilephoto':
        case 'pp':
            if (isBanned) return client.reply(from, `Desculpe, você está banido deste bot...`, id)
            const nekoperfil = await axios.get(`https://nekos.life/api/v2/img/avatar`)
            await client.sendFileFromUrl(from, nekoperfil.data.url, ``, `Foto de perfil pra vc ^-^`, id) 
        break

        case 'neko3':
            if (isBanned) return client.reply(from, `Desculpe, você está banido deste bot...`, id)
            nekol = Math.floor(Math.random() * 3) + 1
            if (nekol == 1) {
				const neko1 = await axios.get(`https://nekos.life/api/v2/img/kemonomimi`)
				await client.sendFileFromUrl(from, neko1.data.url, ``, `Nekoooo chann`, id)
            } else if (nekol == 2) {
				const neko2 = await axios.get(`https://nekos.life/api/v2/img/neko`)
				await client.sendFileFromUrl(from, neko2.data.url, ``, `Nekooo`, id)
            } else if (nekol == 3) {
				const neko3 = await axios.get(`https://nekos.life/api/v2/img/fox_girl`)
				await client.sendFileFromUrl(from, neko3.data.url, ``, `Nekooo`, id)
			}
        break

        case 'everyone':
        case '@everyone':
        case 'tagall':
            if (isBanned) return client.reply(from, `Desculpe, você está banido deste bot...`, id)
			if (isGroupMsg && isGroupAdmins || isowner && isGroupMsg) {
				const groupMem = await client.getGroupMembers(groupId)
				let hehe = `═✪〘 Everyone 〙✪═\n\n`
				for (let i = 0; i < groupMem.length; i++) {
					hehe += `@${groupMem[i].id.replace(/@c.us/g, '')}\n`
				}
				hehe += '\n═✪〘 Obrigado & Amo vocês <3 〙✪═'
				await sleep(2000)
				await client.sendTextWithMentions(from, hehe, id)
			} else if (!isGroupAdmins) {
				await client.reply(from, 'Este comando só pode ser usado por admins ou pelo dono!', id)
			} else {
				await client.reply(from, 'Esse comando apenas pode ser usado em grupos!', id)
			}
            break

		case 'removeadm':
			if (!isGroupMsg) return client.reply(from, 'Você está tentando arquivar o pv?', id)
			if (!isowner) return client.reply(from, `Desculpe mas você não é o dono para realizar esta ação`, id)
			if (!isBotGroupAdmins) return client.reply(from, 'O bot não é admin deste grupo!', id)
			const allAdm = await client.getGroupMembers(groupId)
			for (let i = 0; i < allAdm.length; i++) {
				await client.demoteParticipant(groupId, allAdm[i].id)
            }
		break

        case 'kickall':
        case 'arquivar':
        case 'archive':
        case 'arch':
            if (!isGroupMsg) return client.reply(from, 'Você está tentando arquivar o pv?', id)
            if (!canArchive) return client.reply(from, `Desculpe, você não tem a permissão de arquivar grupos.`, id)
            if (!isBotGroupAdmins) return client.reply(from, 'O bot não é admin deste grupo!', id)
            const allMem = await client.getGroupMembers(groupId)
            for (let i = 0; i < allMem.length; i++) {
                if (groupAdmins.includes(allMem[i].id)) {
					await client.demoteParticipant(groupId, allMem[i].id)
                } else {
                    await client.removeParticipant(groupId, allMem[i].id)
                }
            }
        setGroupTitle(from, `Archived By: Fox`)
        client.reply(from, 'Este grupo foi arquivado!', id)
        break

        case 'addpremium':
            if (!isowner) return client.reply(from, `Apenas o criador pode usar esta função!`, id)
            for (let i = 0; i < mentionedJidList.length; i++) {
                premium.push(mentionedJidList[i])
                fs.writeFileSync('./lib/premium.json', JSON.stringify(premium))
                client.reply(from, 'Usuário agora é premium!', message.id)
            }
        break
        
        case 'removepremium':
        case 'removerpremium':
        case 'adicionarpremium':
            if (!isowner) return client.reply(from, 'Apenas o criador pode usar esta função!', id)
            let prm = premium.indexOf(mentionedJidList[0])
            premium.splice(prm, 1)
            fs.writeFileSync('./lib/premium.json', JSON.stringify(premium))
            client.reply(from, 'Usuário não é mais premium!', message.id)
        break

        case 'addarchive':
		case 'addarch':
            if (!isowner) return client.reply(from, `Apenas o criador pode usar esta função!`, id)
            for (let i = 0; i < mentionedJidList.length; i++) {
                archive.push(mentionedJidList[i])
                fs.writeFileSync('./lib/canarchive.json', JSON.stringify(premium))
                client.reply(from, 'Usuário agora pode arquivar grupos!', message.id)
            }
        break

		case 'anime2':
			if (args.length == 0) return client.reply(from, 'Especifique o nome de um anime!', id)
			const nomeanime2 = body.slice(8)
			const anime2 = await axios.get(`https://api.jikan.moe/v3/search/anime?q=${nomeanime2}`)
			const anime2out = `*Anime encontrado!*\n\n✨️ *Titulo:* ${anime2.data.results[0].title}\n\n🎆️ *Episodios:* ${anime2.data.results[0].episodes}\n\n💌️ *Classificação:* ${anime2.data.results[0].rated}\n\n❤️ *Nota:* ${anime2.data.results[0].score}\n\n💚️ *Sinopse:* ${anime2.data.results[0].synopsis}\n\n🌐️ *Link*: ${anime2.data.results[0].url}`
			client.reply(from, anime2out, id)
		break
		
        case 'removearchive':
		case 'removearch':
            if (!isowner) return client.reply(from, 'Apenas o criador pode usar esta função!', id)
            let arch = archive.indexOf(mentionedJidList[0])
            archive.splice(arch, 1)
            fs.writeFileSync('./lib/canarchive.json', JSON.stringify(premium))
            client.reply(from, 'Usuário não pode mais arquivar grupos!', message.id)
        break

		case 'girl':
    	    var items = ["garota adolescente", "saycay", "alina nikitina", "belle delphine", "teen girl", "teen cute", "japanese girl", "garota bonita oriental", "oriental girl", "korean girl", "chinese girl", "e-girl", "teen egirl", "brazilian teen girl", "pretty teen girl", "korean teen girl", "garota adolescente bonita", "menina adolescente bonita", "egirl", "cute girl"];
    	    var cewe = items[Math.floor(Math.random() * items.length)];
			console.log(cewe)
			var girl = "https://api.fdci.se/sosmed/rep.php?gambar=" + cewe;
			axios.get(girl)
            	.then((result) => {
				var b = JSON.parse(JSON.stringify(result.data));
				var cewek =  b[Math.floor(Math.random() * b.length)];
              	client.sendFileFromUrl(from, cewek, "result.jpg", "Ela é linda não acha?", id)
			})
		break

        case 'addlist':
        case 'ban':
        case 'bloquear':
            if(!isowner) return client.reply(from, 'Apenas o criador pode usar esta função!', message.id)
            for (let i = 0; i < mentionedJidList.length; i++) {
                ban.push(mentionedJidList[i])
                fs.writeFileSync('./lib/banned.json', JSON.stringify(ban))
                client.reply(from, 'Usuário foi banido com sucesso!', message.id)
            }
        break

        case 'cls':
            if(!isowner) return client.reply(from, 'Apenas o criador pode usar esta função!', message.id)
            console.clear()
            client.reply(from, `Console limpo!`, id)
        break

        case 'removelist':
        case 'unban':
        case 'pardon':
        case 'perdoar':
        case 'desbloquear':
            if(!isowner) return client.reply(from, 'Apenas o criador pode usar esta função!', message.id)
            let inx = ban.indexOf(mentionedJidList[0])
            ban.splice(inx, 1)
            fs.writeFileSync('./lib/banned.json', JSON.stringify(ban))
            client.reply(from, 'Usuário foi perdoado!', message.id)
            break

        case 'add':
        case 'adicionar':
            if (!isGroupMsg) return client.reply(from, `Este comando só pode ser usado em grupos.`, id)
            if (!isBotGroupAdmins) return client.reply(from, `O bot deve ser admin para realizar esta ação.`, id)
	        if (args.length !== 1) return client.reply(from, 'Você precisa especificar o número de telefone.', id)
            try {
                await client.removeParticipant(from,`${args[0]}@c.us`)
            } catch {
                console.log('Erro')
            }
        break

        case 'kick':
        case 'remove':
        case 'remover':
            if (!isGroupMsg) return client.reply(from, `Este comando só pode ser usado em grupos.`, id)
            if (isBotGroupAdmins && isGroupAdmins || isowner && isGroupAdmins) {
	        if (args.length !== 1) return client.reply(from, 'Você precisa especificar o número de telefone.', id)
				try {
					await client.removeParticipant(from,`${args[0]}@c.us`)
				} catch {
					console.log('Erro')
				}
			} else {
				client.reply(from, `O bot deve ser admin para realizar esta ação.`, id)
			}
        break
        break

        case 'promote':
            if (isBanned) return client.reply(from, `Desculpe, você está banido deste bot...`, id)
            if (!isGroupMsg) return await client.reply(from, 'Desculpe, este comando só pode ser usado em grupos.', id)
            if (!isGroupAdmins) return await client.reply(from, 'Desculpe, este comando só pode ser usado por admins em grupos.', id)
            if (!isBotGroupAdmins) return await client.reply(from, 'Erro, este comando só pode ser usado caso o bot seja um administrados do grupo.', id)
            if (mentionedJidList.length != 1) return client.reply(from, 'Desculpe, o formato da mensagem está errado, digite !promote @menção.', id)
            if (groupAdmins.includes(mentionedJidList[0])) return await client.reply(from, 'Desculpe o bot não é administrador deste grupo.', id)
            if (mentionedJidList[0] === botNumber) return await client.reply(from, 'Desculpe, o formato da mensagem está errado, digite #kick @menção.', id)
            await client.promoteParticipant(groupId, mentionedJidList[0])
            await client.sendTextWithMentions(from, `Request diterima, menambahkan @${mentionedJidList[0].replace('@c.us', '')} sebagai admin.`)
            break

        case 'demote':
        if (isBanned) return client.reply(from, `Desculpe, você está banido deste bot...`, id)
            if (!isGroupMsg) return client.reply(from, 'Maaf, perintah ini hanya dapat dipakai didalam grup! [Group Only]', id)
            if (!isGroupAdmins) return client.reply(from, 'Gagal, perintah ini hanya dapat digunakan oleh admin grup! [Admin Group Only]', id)
            if (!isBotGroupAdmins) return client.reply(from, 'Gagal, silahkan tambahkan bot sebagai admin grup! [Bot not Admin]', id)
            if (mentionedJidList.length !== 1) return client.reply(from, 'Maaf, format pesan salah silahkan periksa menu. [Wrong Format, Only 1 user]', id)
            if (!groupAdmins.includes(mentionedJidList[0])) return await client.reply(from, 'Maaf, user tersebut tidak menjadi admin. [user not Admin]', id)
            if (mentionedJidList[0] === botNumber) return await client.reply(from, 'Maaf, format pesan salah silahkan periksa menu. [Wrong Format]', id)
            await client.demoteParticipant(groupId, mentionedJidList[0])
            await client.sendTextWithMentions(from, `Request diterima, menghapus jabatan @${mentionedJidList[0].replace('@c.us', '')}.`)
            break

        case 'del':
            if (isBanned) return client.reply(from, `Desculpe, você está banido deste bot...`, id)
            if (!isGroupAdmins) return client.reply(from, 'Gagal, perintah ini hanya dapat digunakan oleh admin grup! [Admin Group Only]', id)
            if (!quotedMsg) return client.reply(from, 'Maaf, format pesan salah silahkan periksa menu. [Wrong Format]', id)
            if (!quotedMsgObj.fromMe) return client.reply(from, 'Maaf, format pesan salah silahkan periksa menu. [Wrong Format]', id)
            client.deleteMessage(quotedMsgObj.chatId, quotedMsgObj.id, false)
            break

        case 'say':
            if (!isowner) return client.reply(from, `Desculpe, você não é o dono deste bot! >:(`, id)
            const saye = body.slice(5)
            await client.sendText(from, saye)
        break

        case 'botstat': {
            if (isBanned) return client.reply(from, `Desculpe, você está banido deste bot...`, id)
            const loadedMsg = await client.getAmountOfLoadedMessages()
            const chatIds = await client.getAllChatIds()
            const groups = await client.getAllGroups()
            client.sendText(from, `Status :\n- *${loadedMsg}* Menssagens carregadas\n- *${groups.length}* Grupos\n- *${chatIds.length - groups.length}* Chats privados\n- *${chatIds.length}* Chats totais`)
            break
        }
        default:
            if (isCmd) {
                console.log(color('[ERROR]', 'red'), color(moment(t * 1000).format('DD/MM/YY HH:mm:ss'), 'yellow'), 'Comando inexistente usado por ', color(pushname, 'yellow'))
                await client.reply(from, `Desculpe, mas este comando não existe...`, id)
            }
            if (message.body === 'bom dia') {
              await client.sendPtt(from, './media/BOM-DIA.mp3', id)
            }
			if (message.body === 'Bom dia') {
              await client.sendPtt(from, './media/BOM-DIA.mp3', id)
            }
			if (message.body === 'BOM DIA') {
              await client.sendPtt(from, './media/BOM-DIA.mp3', id)
            }
			if (message.body === 'Bom Dia') {
              await client.sendPtt(from, './media/BOM-DIA.mp3', id)
            }
        }
    } catch (err) {
        console.error(color(err, 'red'))
    }	
}
    
import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://wfemcjmdkcoxiuadxyrq.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndmZW1jam1ka2NveGl1YWR4eXJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIyNTEzMzYsImV4cCI6MjA2NzgyNzMzNn0.Gyy1tZbius_jtTJ-3Pba8ftI6eszVQ-TPeYcsMPQKk8'
export const supabase = createClient(supabaseUrl, supabaseKey)

// {
//   "type": "service_account",
//   "project_id": "clinic-management-system-v3",
//   "private_key_id": "24748fe5ab4cb394d4725e435b94eea6052f332a",
//   "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDzFkltBRDumvwQ\nzu2L0T18OFpdLseccRVA42imkL+Tx0U4ENANpYlseowT8oE/58JaHgAEJDHHjOgc\ng7wm6yo413MhuJFtOTpNGGION+hdvqvQ1o2YamfvP0yvrY2fMZXIuTs9AKu5/IG0\nx8yx2BmKHWVpI3JsrwwUH50uNjqqMC6+46ba8tqGCpYbxFGMXb9Y0WU9CeZLYZdO\nISPjtxquVLYMp0Z3hj1OG14qSs9NIbeyjTMMBezN9xPk+6GUdj0jpg4jL1FtW1NP\n6Qfck+i1qp8uvzeXFGNux1zMLBBJ6y5/5tO7SOPKybYi5WpYL6+zz/Gb+Cl3zfvk\nZoVdPRUpAgMBAAECggEAIFzGN7pl7644grBZ1bRsoB4Mgb1Zm80+TB46b3pz1uO/\npmAuorJ4IjYKchll9bEQIdk+nU6IRg3PVQSAxxmlzF16mXGuAsGMrnjhjQ0KZXid\n/TajMThxT9u4hObxJNGAJHHsngl500/3oK685KxlcgrJ1n5+nFONoxw2W9Gia8et\n80kbnfFnXE+H1lOYTtjHNBJuFFR2xb+N8EM8k3k0BbE4Edn9wCk33wIrZ9A7BH9i\nw/LNImBuPT01kBxWK4huhUWsDl8SxUUQSUBxPup0oPvxRkaImQNW/DvALhrZBYKg\nijSH57dblfSQDwzXE3pQ0xU5iu9KRYDtgPRjiAerkQKBgQD9VKbKfpB2O0Hu34Ix\nGpP5lLCJn+HZoSJ8tFFAPY7nzOiX20fDstXCvAmsyRYawY/b6FZ/8AheVPoglGiT\nSXwvKr5ZBgmJ1MBEG4B3R4Itd9MslJ38zuyLpxJZNtr7CTWy0dZraqguMaFhLI3R\ndD+J9FB1eIARQ3l6vVsngX4R9QKBgQD1pgDrh1bDipMDfNM6hAGi4lS6b7D7FWPg\nmV3ngFBLFwVud7sgAIu+MeNhdJTj0kyMJhBKNcs/fxPuJC86xxJJ5S6sdP2bkxgu\nradAeI8AWyLvNPA74XqOHhC4xJ0SivsyIIVqgh5HpgEpSPCi0+CHeJvW2y2IeBKT\nOuHOONbR5QKBgG1Wof54DeXZwaVV9p02+XMZR/C+fv4tW/My6HavmwRVHnacgCbp\nAvXfrtVSnSXDMVIav2rMsO/2AVcaduBLMTwyWKGXx3ojxzAeJp5U0MzLEOwG4QGC\nVfoYjATRdkYvPWwGwWLvT9NQPHTyg+tJHzttpWRuM+g/lSjynWs5qq4ZAoGAePti\nFp3YMIQONbiDe51KBQO9QPkDTBXT0+kU45BBe0oCRc64HWHHcUu2teep8K5BPwD8\nIuBtkn8uvKmbjTJAIp66JvuTb8y5KzwhVFJL85vvD6qd6o/5QQczqxxCU8CZSK3V\np4ggC5+JkOC4iykYuv++mMnnmf+w/kwQq/U4b7UCgYAhYs+L9kM6l3gqRTzPUCBu\nhlPR4yyE1HAceJ3DeFQZBaNi4e/+bXRzgRrM0nV9z9/JUUmT1c24CsjsNuxr2xHZ\nn7VXdPWFf52ZGw2WuRSxjX5AKXpSJiG4MxrxsPbnHcPnpHWS6aXMnnY6wYf2Iyc1\naV9sy2LnUowvirq4slEbuQ==\n-----END PRIVATE KEY-----\n",
//   "client_email": "firebase-adminsdk-fbsvc@clinic-management-system-v3.iam.gserviceaccount.com",
//   "client_id": "102286300574951088625",
//   "auth_uri": "https://accounts.google.com/o/oauth2/auth",
//   "token_uri": "https://oauth2.googleapis.com/token",
//   "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
//   "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40clinic-management-system-v3.iam.gserviceaccount.com",
//   "universe_domain": "googleapis.com"
// }
# NoPonto

NoPonto is a mobile attendance app for the young apprentices (*jovens aprendizes*) of Escola Christus. Apprentices clock in and out from their phones, and managers follow attendance in real time, review absence notes and generate AI reports.

Built with **React Native (Expo)**, **Firebase Authentication**, **Cloud Firestore** and the **Google Gemini API**. Runs on Android and iOS.

> The app's user interface is in Brazilian Portuguese, since its users are Brazilian. This README is in English.

---

## Features

### Apprentice
- **Log in** with e-mail and password, choosing the "Aprendiz" profile. Includes show/hide password and "forgot password".
- **Home:** live clock and date, today's status (on time / late), monthly summary (attendance, late arrivals, absences) and the latest absence notes with their approval status.
- **Clock in / clock out:** one button. The app decides whether it is a check-in or a check-out. The time comes from the **Firebase server**, not from the phone.
- **History:** check-in, check-out, total hours worked and the daily status.
- **Absence notes** (*justificativas*): create, edit and delete notes for absences or late arrivals while they are pending.
- **Profile:** personal data, work schedule and logout.

### Manager
- **Dashboard:** real-time metrics for today (expected, present, late and absent apprentices) and a "today's activity" list.
- **Time records:** today's records for every apprentice. Managers can fix wrong times, add a missing record or delete records.
- **Absence notes:** filter by status, then approve or reject one note or many at once (batch write).
- **Users:** create apprentice or manager accounts, set each apprentice's work schedule (start time, end time and working weekdays), edit schedules and deactivate accounts.
- **AI reports:** pick an apprentice and a period (7, 30 or 90 days), and Gemini writes a report about late arrivals, absences and excessive working hours (burnout risk alert).
- **Profile:** personal data and logout.

---

## Tech stack

| Technology | Usage |
|---|---|
| React Native + Expo (SDK 58) | Cross-platform mobile app (tested with Expo Go on a physical device) |
| React Navigation 7 | Stack navigator for login, bottom tabs for apprentice and manager areas |
| Firebase Authentication | E-mail/password login, persistent session (AsyncStorage) and password reset |
| Cloud Firestore | Real-time database and security rules |
| Google Gemini API | AI-generated attendance reports (`gemini-flash-lite-latest`, free tier) |
| react-native-safe-area-context | Keeps content clear of the status bar and navigation bar |

---

## Getting started

### Requirements
- Node.js 20+ and npm
- The **Expo Go** app on your phone (Android or iOS), or an emulator
- A Firebase project and a Gemini API key

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment variables
Copy `.env.example` to `.env` and fill in the values:

```bash
cp .env.example .env
```

| Variable | Where to find it |
|---|---|
| `EXPO_PUBLIC_FIREBASE_*` | Firebase console → Project settings → Your apps → Web app config |
| `EXPO_PUBLIC_GEMINI_API_KEY` | https://aistudio.google.com/apikey |
| `EXPO_PUBLIC_GEMINI_MODEL` | Optional. Defaults to `gemini-flash-lite-latest` |

`.env` is ignored by Git. Never commit real keys.

### 3. Set up Firebase
1. **Authentication** → Sign-in method → enable **Email/Password**.
2. **Firestore Database** → create the database.
3. **Firestore → Rules** → paste the content of [`firestore.rules`](firestore.rules) and click **Publish**.
4. Create the first manager: add a user in **Authentication**, then create a document in the `usuarios` collection whose **document ID is that user's UID**:
   ```json
   { "nome": "Manager name", "matricula": "0000000", "email": "manager@example.com", "tipo": "gestor", "status": "Ativo" }
   ```
   Every other account can then be created from the app (**Usuários** tab).

### 4. Run the app
```bash
npx expo start
```
Scan the QR code with Expo Go. If the phone is not on the same network as the computer, use:
```bash
npx expo start --tunnel
```

---

## Project structure

```
App.js                  Root: AuthProvider + navigation chosen by the logged-in profile
AuthContext.js          Session context: login, logout, password reset, error messages
firebaseConfig.js       Firebase initialization (auth, db, secondary auth for sign-ups)
frequencia.js           Shared attendance rules (tolerance, status, absences, schedules)
css.js                  Shared styles and color tokens
firestore.rules         Firestore security rules
Telas/
  Login.js              Login screen
  Aprendiz/             Apprentice area
    AprendizTabs.js       Bottom tabs
    Inicio.js             Home
    RegistroPonto.js      Clock in/out + history
    Justificativas.js     Absence notes (CRUD)
    Perfil.js             Profile + logout
  Gestor/               Manager area
    NavegacaoGestor.js    Bottom tabs
    Deshboard.js          Real-time dashboard
    RegistrarPonto.js     Time records (fix / delete)
    Justificativas.js     Review absence notes
    Usuario.js            Users: sign-up, schedule, deactivate
    Relatorio.js          AI reports (Gemini)
    Cabecalho.js          Shared header
    Perfil.js             Profile + logout
```

---

## Data model (Firestore)

The collection and field names are in Portuguese to match the app's domain.

| Collection | Fields | Written by |
|---|---|---|
| `usuarios` (document ID = Auth UID) | `nome` (name), `matricula` (student ID), `email`, `tipo` (`aprendiz` / `gestor`), `status` (`Ativo` / `Inativo`), `horaEntrada` / `horaSaida` (start/end time, `HH:MM`), `diasSemana` (working weekdays, 0 = Sunday), `criadoEm` (created at) | Managers only |
| `pontos` (time records) | `usuarioId` (user ID), `tipo` (`entrada` = check-in / `saida` = check-out), `dataHora` (timestamp) | Apprentice (server time only) and managers |
| `justificativas` (absence notes) | `usuarioId`, `tipo` (`Falta` = absence / `Atraso` = late), `motivo` (reason), `data` (date), `status` (`Pendente` / `Aprovado` / `Rejeitado`) | Apprentice creates; managers approve or reject |

## Security rules (summary)

- Users can read only their own data; managers can read everything.
- Only managers can create, edit or deactivate users (including work schedules).
- An apprentice can create a time record only for themselves, and only with **`dataHora == request.time`**, so the app must send `serverTimestamp()`. Changing the phone's clock does not change the record.
- An apprentice can create absence notes only with a pending status, and can edit or delete them only while they are still pending.
- Deactivated accounts (`status: "Inativo"`) are logged out and cannot sign in.

## Attendance rules

All screens use the same functions from [`frequencia.js`](frequencia.js):

| Status | Rule |
|---|---|
| **Presente** (on time) | Check-in up to the apprentice's start time **+ 5 minutes** |
| **Atraso** (late) | Check-in after the tolerance |
| **Ausente / Falta** (absent) | A working day with no check-in, counted after that day's end time |
| **Folga** (day off) | A day that is not one of the apprentice's working weekdays |

Apprentices with no saved schedule use the default: 08:00 to 12:00, Monday to Friday. The tolerance is set by `TOLERANCIA_MINUTOS`.

---

## Team

| Member | Responsibilities |
|---|---|
| Vitor Nunes Bezerra (team lead) | Apprentice tabs, Home and Clock in/History screens |
| Iuri da Silva Menezes | Login and Users screens |
| Lucas Levi da Silva Freitas | Manager time records and absence-note review |
| Hariel Melo de Lima | Apprentice absence notes and Profile screens |
| Henrique Lima Cabral de Almeida | Firebase (auth, database, security rules), navigation, attendance rules, Dashboard and AI reports |

Course: T197 – Mobile Platform Development, Universidade de Fortaleza (Unifor).

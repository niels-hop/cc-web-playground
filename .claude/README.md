# Claude Code Hooks - Bun Installation

Deze directory bevat Claude Code hooks configuratie voor automatische Bun installatie.

## SessionStart Hook

De `SessionStart` hook zorgt ervoor dat Bun automatisch wordt geïnstalleerd bij het starten van elke Claude Code sessie.

### Configuratie

De hook is geconfigureerd in `settings.json` en voert het volgende commando uit:

```bash
curl -fsSL https://bun.com/install | bash
```

### Hoe het werkt

- **Trigger**: Bij het starten of hervatten van een Claude Code sessie
- **Actie**: Installeert Bun runtime via het officiële installatiescript
- **Matcher**: `*` (geldt voor alle sessies)

### Voordelen

- Zorgt ervoor dat Bun altijd beschikbaar is in de ontwikkelomgeving
- Automatiseert het setup proces
- Geen handmatige installatie meer nodig bij elke sessie

### Meer informatie

Voor meer informatie over Claude Code hooks, zie:
https://docs.claude.com/en/docs/claude-code/hooks-guide

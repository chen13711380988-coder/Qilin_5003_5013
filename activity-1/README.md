# Activity 1 — Pause and Break

A green, nature-inspired screen-break timer for students and office workers who want short breaks from screen time.

## My original idea

> Let’s use file activity 1 for doing this activity. In this activity, please design a page for people (students or officers that suffer from dry eye issues) who need a quick break from long screen time where they choose how often and how much time they need to take a break from screen time.
>
> Main interaction: When someone selects a break length, how often they should take a break from screen time, the experience should display a natural scene with comfortable or relaxed audio that reminds people they should take a break. This experience can both show on the website page and be a pop-up notification that appears on the notification section on the computer when people are browsing other websites or apps.
>
> Design: One button with 4 sub-buttons to choose break length—“20 seconds,” “1 minutes,” and “custom time.” Another button with 3 sub-buttons for choosing break frequencies - take a break every “20 minutes,” “40 minutes”, and “custom time.” Another button for resetting the time.
>
> Visuals: Using green as the main color palette.


The brief mentions four length choices but names three. This implementation uses the three named choices and displays “1 minute” with corrected grammar.

## Open or run

For a quick look, open `dist/index.html` in a modern browser. All three photos and audio recordings are bundled in `dist/assets`; no streaming connection is required.

For desktop notification support, serve the page on localhost or HTTPS:

```sh
cd activity-1
python3 -m http.server 8080 --directory dist
```

Open http://localhost:8080. No build step, npm installation, or API keys are required. Python is only used to serve the files. Alternatively, serve `dist` with any static web server.

## Use the page

1. Choose 20 seconds, 1 minute, or a custom break length (1–3,600 seconds).
2. Choose a break every 20 minutes, 40 minutes, or a custom interval (0.1–240 minutes).
3. Enable desktop reminders and allow browser notifications if wanted.
4. Click **Start my rhythm**. Leave this tab open while working elsewhere.
5. Choose **Forest**, **Ocean**, or **Rain**. Each scene has a matching real recording: birdsong, ocean waves, or rainfall. Click **Play sound** to listen immediately and adjust **Volume**. **Stop sound** silences audio and disables automatic break audio until you press Play sound again.
6. At break time, the matching recording plays when sound is enabled. Briefly enjoy the scene, then look away from the screen.
7. The next focus interval starts automatically after the break. Use **Pause timer**, **Take a break now**, or **Finish break** as needed.
8. **Reset timer** stops the timer and returns to a full focus interval, keeping your settings. Changing a setting also resets the timer so the new rhythm starts clearly.

Timers use elapsed wall-clock time to reduce drift. Browsers can throttle or suspend background tabs, and computer sleep delays delivery. The app checks the timer when execution resumes. Reminders cannot run after the page is closed. System notification appearance, sound, and delivery depend on browser permissions, operating-system settings, and Do Not Disturb. Notifications show text; the scene and relaxing audio stay on the web page. No background push server is included.

Sound starts only after a page interaction, in accordance with browser autoplay rules. Preferences and timer state reset when the page reloads. This is a break-reminder activity, not a treatment or diagnostic tool.

## Files

- `dist/index.html`: accessible page structure and controls
- `dist/style.css`: green palette and responsive layout
- `dist/app.js`: countdown, break cycle, scene selection, real audio playback, and optional desktop notifications
- `dist/assets/`: bundled JPG scenes and MP3 nature recordings
- `.openai/hosting.json`: Sites deployment configuration

## AI tool used

OpenAI Codex in the desktop app was used to design and implement the HTML, CSS, and JavaScript and to prepare this README. Sites skills were used for the website workflow. No image-generation tool was used.

## Selected prompts

- The original activity prompt is reproduced above.
- Asset-search prompt used by Codex: “Find one real serene green forest lake photograph using web image search. Return verified image URL and source page plus attribution info. … For a calming screen-break page full large landscape panel.”

## Image and audio credits

Photo: **Bryce Evans**, “Green woods near Brohm Lake,” on [Unsplash](https://unsplash.com/photos/choc7LYd98I), provided under the [Unsplash License](https://unsplash.com/license). The photo is bundled locally.

Photos and recordings are paired by setting; they were not captured together. No synthesized audio is used in this revision. A single looping HTML audio player switches with the selected scene, preventing multiple tracks from playing together.

| Scene | Photo | Recording and license |
| --- | --- | --- |
| Forest | [Bryce Evans](https://unsplash.com/photos/choc7LYd98I) | [Common Blackbird song — Diana Tudor](https://commons.wikimedia.org/wiki/File:Common_Blackbird_song_(Turdus_merula).ogg), [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) |
| Ocean | [James Park](https://unsplash.com/photos/mJ2Rsa_Btsw) | [Oceanwavescrushing — Luftrum](https://commons.wikimedia.org/wiki/File:Oceanwavescrushing.ogg), [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/) |
| Rain | [Shutter Verse](https://unsplash.com/photos/AuTZAjMj6Lg) | [Sound of rain — Effib](https://commons.wikimedia.org/wiki/File:Sound_of_rain.ogg), [CC BY-SA 3.0](https://creativecommons.org/licenses/by-sa/3.0/) |

All photos use the [Unsplash License](https://unsplash.com/license). The audio files are adapted from Wikimedia Commons MP3 transcodes: their levels were normalized for consistent audibility, peaks were gently limited, and short edge fades were applied for looping. Each adapted recording is distributed under its original license (rain: CC BY-SA 3.0). Their original licenses and attribution apply to the bundled recordings. Photo and audio credits are also available on the page.

If you cannot hear audio, click **Play sound**, set the page volume above zero, and check whether your browser tab or computer is muted. A playback status or error is shown below the volume control. Browser autoplay restrictions may require another click.

## Requested revision

> Please give a new name for this page - "Pause and Break."
> Make the natural scenes displayed on the screen can be changed by users' preferences.
> Make the natural sound in the page can be really be heard and match the scenes displayed.

Implemented: updated name, three scene choices, real local audio recordings matched to the scenes, immediate playback controls, volume control, and playback/error status.

## My reflection

<!-- Write your own short reflection here. -->

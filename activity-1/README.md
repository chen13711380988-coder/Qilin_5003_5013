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

For a quick look, open `dist/index.html` in a modern browser. All five scene photos and the audio recordings are bundled in `dist/assets`; no streaming connection is required.

For desktop notification support, serve the page on localhost or HTTPS:

```sh
cd activity-1
python3 -m http.server 8080 --directory dist
```

Open http://localhost:8080. Use a current browser supporting Web Locks (such as current Chrome, Edge, Firefox, or Safari) on localhost or HTTPS for the tracked timer. No build step, npm installation, or API keys are required. Python is only used to serve the files. Alternatively, serve `dist` with any static web server.

## Use the page

1. Choose 20 seconds, 1 minute, or a custom break length (1–3,600 seconds).
2. Choose a break every 20 minutes, 40 minutes, or a custom interval (0.1–240 minutes).
3. Enable desktop reminders and allow browser notifications if wanted.
4. Click **Start my rhythm**. Leave this tab open while working elsewhere.
5. Choose **Forest**, **Ocean**, **Rain**, **Meadow**, or **Stream**. Scene audio includes birdsong, ocean waves, rainfall, and flowing water. Forest and Meadow share the birdsong recording. Click **Play sound** to listen immediately and adjust **Volume**. **Stop sound** silences audio and disables automatic break audio until you press Play sound again.
6. At break time, the matching recording plays when sound is enabled. Briefly enjoy the scene, then look away from the screen.
7. The next focus interval starts automatically after the break. Use **Pause timer**, **Take a break now**, or **Finish break** as needed.
8. **Reset timer** stops the timer and returns to a full focus interval, keeping your settings. Changing a setting also resets the timer so the new rhythm starts clearly.

Timers use elapsed wall-clock time to reduce drift. Browsers can throttle or suspend background tabs, and computer sleep delays delivery. The app checks the timer when execution resumes. Reminders cannot run after the page is closed. System notification appearance, sound, and delivery depend on browser permissions, operating-system settings, and Do Not Disturb. Notifications show text; the scene and relaxing audio stay on the web page. No background push server is included.

Sound starts only after a page interaction, in accordance with browser autoplay rules. Preferences and timer state reset when the page reloads; recorded history stays in this browser. This is a break-reminder activity, not a treatment or diagnostic tool.

## Files

- `dist/index.html`: accessible page structure and controls
- `dist/style.css`: green palette and responsive layout
- `dist/app.js`: countdown, break cycle, scene selection, real audio playback, and optional desktop notifications
- `dist/assets/`: bundled JPG scenes and MP3 nature recordings
- `dist/history.js`: local date grouping and persistent duration totals
- `tests/history.test.mjs`: timer, history, and date-boundary checks
- `.gitignore`: excludes local system files and optional Sites metadata
- `.openai/hosting.json` (local only, if present): optional Sites configuration; not needed to run the project and not included in GitHub

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

This first revision introduced the updated name, three scene choices, real local audio recordings, immediate playback controls, volume control, and playback/error status. The later update expanded the selection to five scenes, as described below.

## Time history and eye-care update

The page now has five scenes, a day/week/month time summary with previous-period navigation, and an explanation of the 20-20-20 rule. The one-click **Use the 20-20-20 rhythm** control sets a 20-second break every 20 minutes and leaves the timer ready to start. During the break, look at a real object about 20 feet (6 metres) away, rather than continuing to watch the scene.

### What is recorded

- Only running focus and break intervals are counted. Focus time is an estimate of screen use; the page cannot observe other apps, eye gaze, or whether a break was actually taken.
- Pausing, resetting, closing, or reloading stops tracking. Resetting keeps history. Past sessions from earlier versions cannot be recovered.
- History is saved to localStorage in this browser on this device, under `pause-and-break-history-v1`. It is not uploaded to GitHub or a server. Clearing browser/site data removes it. Different browsers, devices, or origins (including localhost versus a published site) have separate histories.
- Weeks run Monday–Sunday; months follow the local calendar. Sessions crossing midnight are split into the correct local dates, including daylight-saving changes.
- Only one timer can run per origin at once, using Web Locks to avoid duplicate counts across tabs.
- Gaps over 90 seconds between timer checks, or backwards clock changes, pause tracking and exclude the unobserved gap. Shorter suspension or idle gaps may still count, so this is not a precise device screen-time monitor. A delayed break starts when the page can run again; it is not backdated.
- History is saved every five seconds and on timer actions or page hide. Abrupt browser termination may lose the latest unsaved seconds. If browser storage is blocked or full, the timer still works with in-memory history and shows a notice.

### Additional assets

- Meadow: [Hero Ding](https://unsplash.com/photos/HC5pVT_rBno), Unsplash License. Paired with the existing Diana Tudor birdsong (CC BY 4.0).
- Stream: [Eric Muhr](https://unsplash.com/photos/qMMpyTwBQBA), Unsplash License.
- Stream audio: [Forest lawn creek — Dsw4](https://commons.wikimedia.org/wiki/File:Forest_lawn_creek.ogg), public domain. Adapted to a 60-second excerpt with volume normalization, peak limiting, and brief fades.

### Eye-care sources

The page explains the goal of regular breaks, changing focus, blinking, and reducing dry environmental exposure. It does not claim that breaks cure dry eye or meibomian gland dysfunction, and encourages following professional eye-care advice.

- [American Academy of Ophthalmology: screen breaks and the 20-20-20 rule](https://www.aao.org/eye-health/tips-prevention/should-you-be-worried-about-blue-light)
- [National Eye Institute: Dry Eye](https://www.nei.nih.gov/eye-health-information/eye-conditions-and-diseases/dry-eye)

### Selected follow-up prompt

“Add two more natural scenes; add an area tracking screen time and break duration for each day/week/month; explain the benefits of the 20-20-20 rule and eye-protection tips.”

### Optional verification

With Node.js installed, run from `activity-1`:

```sh
TZ=America/New_York node tests/history.test.mjs
```

Checks cover focus/rest accounting, pauses, reset, reload persistence, cross-tab exclusion, scene/audio mapping, inactive gaps, local midnight, week/month boundaries, leap years, daylight-saving time, and unavailable or invalid storage.

## Rotating eye-rest messages

The scene starts with “Give your eyes a moment to rest.” Each new break advances to the next message, then loops through all four:

- Give your eyes a moment to rest.
- Pause your screen. Rest your eyes.
- A little break for your hardworking eyes.
- Look away, blink gently, and relax your eyes.

Both scheduled breaks and **Take a break now** advance the message. Pausing/resuming, changing scenes, and resetting do not advance it. Reloading starts the sequence again. The distance reminder remains visible separately during breaks.

## Time-summary bar chart

The day/week/month summary uses three horizontal bars: screen/focus time, break time, and total recorded time. All bars share a scale; the total bar combines the same focus and break colors to show that it is their sum, not additional time. Exact duration labels remain readable even for very short breaks. Empty periods show empty tracks, and the daily table is available under **View daily breakdown**. Displayed values use whole seconds.

## Revision summary

The current project includes all of these requested updates:

| Update | Current behavior |
| --- | --- |
| Page name | The header and browser title use **Pause and Break**. |
| Header cleanup | The “Activity 01” label is removed from the page header. |
| Scene selection | Users can choose Forest, Ocean, Rain, Meadow, or Stream. |
| Audible nature sound | Bundled real recordings match the setting, with Play/Stop controls and adjustable volume. |
| Time history | Running focus and break intervals are stored locally, with day/week/month views and previous-period navigation. |
| Eye-care information | The page explains its purpose, the 20-20-20 rule, practical eye-care tips, and links to sources. A button applies a 20-second break every 20 minutes. |
| Rotating scene sentences | The four eye-rest messages listed above cycle whenever a new break starts. |
| Countdown label | During a running focus interval, the label reads **“Your next pause for tired eyes”**, styled in uppercase. Idle and rest states retain their own labels. |
| Bar chart | Screen time, break time, and their combined total appear on a shared scale with exact duration labels. The daily breakdown remains available. |
| English interface | Page text is in English. Day, week, and month headings explicitly use the `en-US` locale regardless of browser language; dates are still grouped using local time. The daily table uses numeric `YYYY-MM-DD` dates. |

### Additional selected prompts

- “Remove word ‘activity 01’ … on the page.”
- “Each time the user starts a break, the sentence would change to another sentence (changing between the 4 options).”
- “I think ‘Your next pause for tired eyes’ is good. Let's change it to this sentence.”
- “Make the area that tracks people's break time, screen time and time recorded … an aesthetic bar chart.”
- “The date should be in English … keep all text on this page in English.”

## Saved project and repository

The maintained project folder is **`activity-1`**. It is connected to [Qilin_5003_5013 on GitHub](https://github.com/chen13711380988-coder/Qilin_5003_5013/tree/main/activity-1), on the `main` branch. Use this folder for the current source, README, tests, and bundled assets. The repository's top-level README is separate from this project README.

Time-history records are browser data, not source files, and are intentionally not uploaded to GitHub. The reflection below was written by the project author.

## My reflection

Firstly, I expect the page to help users remind themselves to relax their eyes and take a break from screen time, so the whole page may convey the theme of eye relaxation while keeping its timer on. But the first version it generated was more like a break-and-work timer that may ask people to stop working, which doesn’t match my ideas well. But all the features it generated work well, as I expected. I think that happens because my initial prompts only clearly described the features that I want to have on the page; I didn’t state my value, my position, and why I chose to design this page very clearly. So after testing the page, I make a more detailed statement about my value and background, I clarify the page’s extended experience more clearly, and I also add more sections to extend features (like statistics bar for time recording and tops section) on my page to make it more useful as a website that can be beneficial to keep eyes healthy.

Secondly, I noticed that AI always makes extensions based on my ideas. I didn’t ask AI to generate many texts on the scene that displayed on my page. But AI generates many texts by itself to enrich the content of the page, and most of the text doesn’t match the theme of the page very well, so I changed some texts.

In addition, I expect the page to be in English. However, while all texts are in English, the “date” selection button on the page is in Chinese. Initially, I provide the prompts that only includes features that I want to have on the page, I didn’t ask AI to generate many texts on the scene that displayed on my page. But AI generates many texts by itself to enrich the content of the page, and most of the text doesn’t match the theme of the page very well, so I change some texts. For example, I change the text from "A small pause can fit into a busy day." to four sentences that rotate in order each time a new break starts, to better match my ideas.

In addition, I expect AI to add an area that tracks and shows users’ screen time and break time to let users better know about their screen time and their eyes' relaxation condition in a direct way. After testing the page, I found that what I got has clear basic information, but the visuals don’t match what I want. It simply shows all times in text, which I think is too boring and makes users not want to browse it. So I asked AI to change it and show those times in an aesthetic bar chart, which allows users to track and compare their screen time and break time each day, week, and month.

What remains uncertain is that I don’t know how I can let my page turn into a small pop-up window on the desktop like a widget on a user's desktop when users open "Desktop Reminder" on the page. Currently, what I got from AI is a regular pop-up notification when it times out. I have difficulty clearly describing what I really need to develop the feature I want.

Overall, based on my experience using experience, I think AI can have wonderful execution when I have very clear prompts with reasonable logic, specific descriptions, and details. If my own values, and requirements misses some important information, the output from AI always need to be revised since its AI’s own execution may not always match our idea.

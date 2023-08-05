import { logger, remove } from '@/utils';
import { Sound } from '@pixi/sound'

const TAG = 'SoundManager';
const VOLUME = 0.5;

/**
 * audio types
 */
export type IAudioTypes = Sound | HTMLAudioElement;

export abstract class Live2dSoundManager<IA extends IAudioTypes = IAudioTypes> {
    
    /**
     * Audio elements playing or pending to play. Finished audios will be removed automatically.
     */
    audios: IA[] = [];
    analysers: AnalyserNode[] = [];
    contexts: AudioContext[] = [];

    protected _volume = VOLUME;

    get volume(): number {
        return this._volume;
    }

    set volume(value: number) {
        this._volume = (value > 1 ? 1 : value < 0 ? 0 : value) || 0;
        this.audios.forEach(audio => (audio.volume = this._volume));
    }

    /**
     * Creates an audio element and adds it to the {@link audios}.
     * @param file - URL of the sound source.
     * @param onFinish - Callback invoked when the playback has finished.
     * @param onError - Callback invoked when error occurs.
     * @return Created audio element.
     */
    abstract add(source: string, onFinish?: () => void, onError?: (e: Error) => void) : IA

    /**
     * Plays the sound.
     * @param audio - An audio element.
     * @return Promise that resolves when the audio is ready to play, rejects when error occurs.
     */
    abstract play(audio: IA): Promise<void>

    abstract addContext(audio: IA): AudioContext

    abstract addAnalyzer(audio: IA, context: AudioContext): AnalyserNode

    abstract analyze(analyser: AnalyserNode): number

    abstract dispose(audio: IA): void

    abstract destroy(): void
}

export class HTMLSoundManager extends Live2dSoundManager<HTMLAudioElement> {

    add(source: string, onFinish?: (() => void) | undefined, onError?: ((e: Error) => void) | undefined): HTMLAudioElement {
        const audio = new Audio(source);
        audio.crossOrigin = "anonymous";

        audio.volume = this._volume;
        audio.preload = 'none';

        audio.addEventListener('ended', () => {
            this.dispose(audio);
            onFinish?.();
        });

        audio.addEventListener('error', (e: ErrorEvent) => {
            this.dispose(audio);
            logger.warn(TAG, `Error occurred on "${source}"`, e.error);
            onError?.(e.error);
        });

        this.audios.push(audio);

        return audio;
    }

    play(audio: HTMLAudioElement): Promise<void> {
        return new Promise((resolve, reject) => {
            // see https://developers.google.com/web/updates/2017/09/autoplay-policy-changes
            audio.play()?.catch(e => {
                audio.dispatchEvent(new ErrorEvent('error', { error: e }));
                reject(e);
            });

            if (audio.readyState === audio.HAVE_ENOUGH_DATA) {
                resolve();
            } else {
                audio.addEventListener('canplaythrough', resolve as () => void);
            }
        });
    }

    addContext(audio: HTMLAudioElement): AudioContext {
        const context = new (AudioContext)();

        this.contexts.push(context);
        return context;
    }

    addAnalyzer(audio: HTMLAudioElement, context: AudioContext): AnalyserNode {
        const source = context.createMediaElementSource(audio);
        const analyser = context.createAnalyser();

        analyser.fftSize = 256;
        analyser.minDecibels = -90;
        analyser.maxDecibels = -10;
        analyser.smoothingTimeConstant = 0.85;

        source.connect(analyser);
        analyser.connect(context.destination);

        this.analysers.push(analyser);
        return analyser;
    }

    analyze(analyser: AnalyserNode): number {
        if(analyser != undefined){
            let pcmData = new Float32Array(analyser.fftSize);
            let sumSquares = 0.0;
            analyser.getFloatTimeDomainData(pcmData);

            for (const amplitude of pcmData) { sumSquares += amplitude*amplitude; }
            return parseFloat(Math.sqrt((sumSquares / pcmData.length) * 20).toFixed(1));
        } else {
            return parseFloat(Math.random().toFixed(1));
        }
    }

    dispose(audio: HTMLAudioElement): void {
        audio.pause();
        audio.removeAttribute('src');

        remove(this.audios, audio);
    }

    destroy(): void {
        for (let i = this.contexts.length - 1; i >= 0; i--) {
            this.contexts[i]!.close()
        }
        
        for (let i = this.audios.length - 1; i >= 0; i--) {
            this.dispose(this.audios[i]!);
        }
    }

}
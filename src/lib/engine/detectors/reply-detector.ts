import { ForwardDetector, DetectionResult } from './types';
import { Cleaner } from '../utils/cleaner';

/**
 * Reply detector - matches "On [date], [user] wrote:" and its localized variations
 * These are common in reply headers (Apple Mail, Outlook, etc.)
 */
export class ReplyDetector implements ForwardDetector {
    readonly name = 'reply';
    readonly priority = 150;

    // Localized patterns based on email-forward-parser's separator_with_information
    private patterns = [
        /^\s*>?\s*Dne\s+(?<date>.+)\,\s+(?<from_name>.+)\s*[\[|<]?(?<from_address>.+)?[\]|>]?\s+napsal\(a\)\s*:/mi,
        /^\s*>?\s*D.\s+(?<date>.+)\s+skrev\s+"(?<from_name>.+)"\s*[\[|<]?(?<from_address>.+)?[\]|>]? ?: ?/mi,
        /^\s*>?\s*Am\s+(?<date>.+)\s+schrieb\s+"(?<from_name>.+)"\s*[\[|<]?(?<from_address>.+)?[\]|>]? ?: ?/mi,
        /^\s*>?\s*On\s+(?<date>.+)\,\s+"(?<from_name>.+)"\s*[\[|<]?(?<from_address>.+)?[\]|>]?\s+wrote ?: ?/mi,
        /^\s*>?\s*On\s+(?<date>.+)\s+at\s+(?<time>.+)\,\s+(?<from_name>.+)\s*[\[|<]?(?<from_address>.+)?[\]|>]?\s+wrote ?: ?/mi,
        /^\s*>?\s*On\s+(?<date>.+)\,\s+(?<from_name>.+)\s*[\[|<]?(?<from_address>.+)?[\]|>]?\s+wrote ?: ?/mi,
        /^\s*>?\s*On\s+(?<date>.+)\s+(?<from_name>.+)\s*[\[|<]?(?<from_address>.+)?[\]|>]?\s+wrote ?: ?/mi,
        /^\s*>?\s*El\s+(?<date>.+)\,\s+"(?<from_name>.+)"\s*[\[|<]?(?<from_address>.+)?[\]|>]?\s+escribió ?: ?/mi,
        /^\s*>?\s*Le\s+(?<date>.+)\,\s+[«"]?(?<from_name>.+)[»"]?\s*[\[|<]?(?<from_address>.+)?[\]|>]?\s+a écrit ?: ?/mi,
        /^\s*>?\s*(?<from_name>.+)\s*[\[|<]?(?<from_address>.+)?[\]|>]?\s+kirjoitti\s+(?<date>.+) ?: ?/mi,
        /^\s*>?\s*(?<date>.+)\s+időpontban\s+(?<from_name>.+)\s*[\[|<|(]?(?<from_address>.+)?[\]|>|)]?\s+ezt írta ?: ?/mi,
        /^\s*>?\s*Il giorno\s+(?<date>.+)\s+"(?<from_name>.+)"\s*[\[|<]?(?<from_address>.+)?[\]|>]?\s+ha scritto ?: ?/mi,
        /^\s*>?\s*Op\s+(?<date>.+)\s+heeft\s+(?<from_name>.+)\s*[\[|<]?(?<from_address>.+)?[\]|>]?\s+geschreven ?: ?/mi,
        /^\s*>?\s*(?<from_name>.+)\s*[\[|<]?(?<from_address>.+)?[\]|>]?\s+skrev følgende den\s+(?<date>.+) ?: ?/mi,
        /^\s*>?\s*Dnia\s+(?<date>.+)\s+[„"]?(?<from_name>.+)[”"]?\s*[\[|<]?(?<from_address>.+)?[\]|>]?\s+napisał ?: ?/mi,
        /^\s*>?\s*Em\s+(?<date>.+)\,\s+"(?<from_name>.+)"\s*[\[|<]?(?<from_address>.+)?[\]|>]?\s+escreveu ?: ?/mi,
        /^\s*>?\s*(?<date>.+)\s+пользователь\s+"(?<from_name>.+)"\s*[\[|<]?(?<from_address>.+)?[\]|>]?\s+написал ?: ?/mi,
        /^\s*>?\s*(?<date>.+)\s+používateľ\s+(?<from_name>.+)\s*\([\[|<]?(?<from_address>.+)?[\]|>]\)?\s+napísal ?: ?/mi,
        /^\s*>?\s*Den\s+(?<date>.+)\s+skrev\s+"(?<from_name>.+)"\s*[\[|<]?(?<from_address>.+)?[\]|>]?\s+följande ?: ?/mi,
        /^\s*>?\s*"(?<from_name>.+)"\s*[\[|<]?(?<from_address>.+)?[\]|>]?\,\s+(?<date>.+)\s+tarihinde şunu yazdı ?: ?/mi
    ];

    detect(text: string): DetectionResult {
        // 1. Expert Normalization
        const normalized = Cleaner.normalize(text);
        const lines = normalized.split('\n');

        // Search in the first 30 lines
        for (let i = 0; i < Math.min(lines.length, 30); i++) {
            const line = lines[i].trim();
            if (!line) continue;

            const nextLine = (i + 1 < lines.length) ? lines[i + 1].trim() : '';
            const combinedLine = `${line} ${nextLine}`.trim();

            for (const pattern of this.patterns) {
                let match = line.match(pattern);
                let isMultiLine = false;

                if (!match) {
                    match = combinedLine.match(pattern);
                    isMultiLine = !!match;
                }

                if (match && match.groups) {
                    const { from_name, from_address, date, time } = match.groups;
                    const fullDate = time ? `${date} ${time}` : date;
                    const lastHeaderIndex = isMultiLine ? i + 1 : i;

                    // 2. Expert Body Extraction
                    const bodyContent = Cleaner.extractBody(lines, lastHeaderIndex);
                    const finalBody = line.startsWith('>') ? Cleaner.stripQuotes(bodyContent) : bodyContent;

                    return {
                        found: true,
                        detector: this.name,
                        email: {
                            from: {
                                name: from_name?.trim() || '',
                                address: from_address?.trim() || ''
                            },
                            date: fullDate?.trim(),
                            body: finalBody
                        },
                        message: i > 0 ? lines.slice(0, i).join('\n').trim() : undefined,
                        confidence: 'medium'
                    };
                }
            }
        }

        return { found: false, confidence: 'low' };
    }
}

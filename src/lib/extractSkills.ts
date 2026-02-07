function escapeRegExp(string: string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

export const extractSkillsFromText = (text: string) => {
    const commonSkills = [
        "JavaScript", "TypeScript", "React", "Next.js", "Node.js",
        "Python", "Java", "C++", "C#", "SQL", "NoSQL", "AWS", "Docker",
        "Kubernetes", "Git", "HTML", "CSS", "Tailwind", "Machine Learning"
    ];

    const foundSkills = commonSkills.filter(skill => {
        const escapedSkill = escapeRegExp(skill);
        // Use non-word boundary (?:^|\\W) instead of \\b to handles skills with special chars like C++
        // This matches: (Start OR Non-Word) + Skill + (End OR Non-Word)
        const regex = new RegExp(`(?:^|\\W)${escapedSkill}(?:$|\\W)`, 'i');
        return regex.test(text);
    });

    return [...new Set(foundSkills)];
};

export const extractEmail = (text: string) => {
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
    const match = text.match(emailRegex);
    return match ? match[0] : "No email found";
};

export const extractName = (text: string) => {
    if (!text) return "Unknown Candidate";
    // Very basic heuristic: First line or capitalized words at start
    const lines = text.split('\n').filter(line => line.trim().length > 0);
    if (lines.length > 0) {
        return lines[0].trim().substring(0, 30); // simplistic
    }
    return "Unknown Candidate";
};

export const parseTags = (tags: string): string[] => (
    tags.split(',')
        .map(cleanTag)
        .filter((tag) => tag)
        .sort()
        .filter((value, index, array) => !index || value !== array[index - 1])
)

export const serializeTags = (tags: string[]): string => (
    tags.join(', ')
)

export const compactSerializeTags = (tags: string[]): string => (
    tags.join(',')
)

const cleanTag = (tag: string): string => (
    tag.trim()
        .toLowerCase()
        .replace(/\s+/g, '_')
)
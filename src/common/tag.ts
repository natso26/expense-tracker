export const parseTags = (tags: string) => (
    tags.split(',')
        .map(cleanTag)
        .filter((tag) => tag)
        .sort()
        .filter((value, index, array) => !index || value !== array[index - 1])
)

export const serializeTags = (tags: string[]) => (
    tags.join(', ')
)

export const cleanTag = (tag: string) => (
    tag.trim()
        .toLowerCase()
        .replace(/\s+/g, '_')
)
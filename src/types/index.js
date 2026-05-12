

/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} username
 * @property {string} [profilePicture]
 * @property {string} createdAt
 */

/**
 * @typedef {Object} Story
 * @property {string} id
 * @property {string} title
 * @property {string} userId
 * @property {string} contentJson
 * @property {string} createdAt
 * @property {string} updatedAt
 * @property {string} [thumbnail]
 */

/**
 * @typedef {Object} ContentElement
 * @property {string} id
 * @property {'text'|'image'|'video'|'audio'} type
 * @property {number} x
 * @property {number} y
 * @property {number} width
 * @property {number} height
 * @property {number} rotation
 * @property {number} zIndex
 * @property {any} content
 */

/**
 * @typedef {Object} TextContent
 * @property {string} text
 * @property {number} fontSize
 * @property {string} fontWeight
 * @property {string} color
 * @property {string} textAlign
 */

/**
 * @typedef {Object} ImageContent
 * @property {string} url
 * @property {string} alt
 */

/**
 * @typedef {Object} VideoContent
 * @property {string} url
 * @property {string} title
 * @property {boolean} autoplay
 */

/**
 * @typedef {Object} AudioContent
 * @property {string} url
 * @property {string} title
 * @property {boolean} autoplay
 */

/**
 * @typedef {Object} AuthContextType
 * @property {User|null} user
 * @property {function(string, string): Promise<boolean>} login
 * @property {function(string, string): Promise<boolean>} register
 * @property {function(): void} logout
 * @property {function(Partial<User>): Promise<boolean>} updateProfile
 */

export {};

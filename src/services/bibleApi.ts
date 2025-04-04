import axios from 'axios';

const BASE_URL = 'https://bible.helloao.org/api';

interface BibleVersion {
  id: string;
  name: string;
  language: string;
}

interface BibleBook {
  book: string; // e.g. 'GEN', 'EXO'
  name: string; // Full book name
  chapters: number;
  testament: 'OT' | 'NT';
}

interface Verse {
  verse: number;
  text: string;
}

interface Commentary {
  id: string;
  name: string;
  description: string;
  language: string;
}

export const BibleApi = {
  // Get available translations
  async getTranslations(): Promise<BibleVersion[]> {
    const response = await axios.get(`${BASE_URL}/available_translations.json`);
    return response.data;
  },

  // Get books for a specific translation
  async getBooks(translation: string): Promise<BibleBook[]> {
    const response = await axios.get(`${BASE_URL}/${translation}/books.json`);
    return response.data.map(book => ({
      ...book,
      testament: book.book.startsWith('1') || 
                book.book.startsWith('2') || 
                book.book.startsWith('3') || 
                book.book === 'MAT' ? 'NT' : 'OT'
    }));
  },

  // Get chapter verses
  async getChapter(translation: string, book: string, chapter: number): Promise<Verse[]> {
    const response = await axios.get(`${BASE_URL}/${translation}/${book}/${chapter}.json`);
    return Object.entries(response.data)
      .map(([verse, text]) => ({
        verse: Number(verse),
        text: text as string
      }));
  },

  // Get available commentaries
  async getCommentaries(): Promise<Commentary[]> {
    const response = await axios.get(`${BASE_URL}/available_commentaries.json`);
    return response.data;
  },

  // Get commentary books
  async getCommentaryBooks(commentaryId: string): Promise<BibleBook[]> {
    const response = await axios.get(`${BASE_URL}/c/${commentaryId}/books.json`);
    return response.data;
  },

  // Get commentary content
  async getCommentary(commentaryId: string, book: string, chapter: number): Promise<string> {
    const response = await axios.get(`${BASE_URL}/c/${commentaryId}/${book}/${chapter}.json`);
    return response.data;
  }
};

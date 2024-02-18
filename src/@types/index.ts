// Internal
type IFormatTokens = {
  [key: string]: string | number | boolean | null;
};

// MyAnimeList
type IListTypes = 'animelist' | 'mangalist';

interface IGenre {
  id: number;
  name: string;
}

interface IDemographic {
  id: number;
  name: string;
}

type IAnimeList = IAnime[];

interface IAnime {
  status: number;
  score: number;
  tags: string;
  is_rewatching: any;
  num_watched_episodes: number;
  created_at: number;
  updated_at: number;
  anime_title: any;
  anime_title_eng: string;
  anime_num_episodes: number;
  anime_airing_status: number;
  anime_id: number;
  anime_studios: any;
  anime_licensors: any;
  anime_season: any;
  anime_total_members: number;
  anime_total_scores: number;
  anime_score_val: number;
  anime_score_diff: number;
  anime_popularity: number;
  has_episode_video: boolean;
  has_promotion_video: boolean;
  has_video: boolean;
  video_url: string;
  genres: IGenre[];
  demographics: IDemographic[];
  title_localized: any;
  anime_url: string;
  anime_image_path: string;
  is_added_to_list: boolean;
  anime_media_type_string: string;
  anime_mpaa_rating_string?: string;
  start_date_string?: string;
  finish_date_string?: string;
  anime_start_date_string?: string;
  anime_end_date_string?: string;
  days_string?: number;
  storage_string: string;
  priority_string: string;
  notes: string;
  editable_notes: string;
}

type IMangaList = IManga[];

interface IManga {
  id: number;
  status: number;
  score: number;
  tags: string;
  is_rereading: any;
  num_read_chapters: number;
  num_read_volumes: number;
  created_at: number;
  manga_title: string;
  manga_english: string;
  manga_num_chapters: number;
  manga_num_volumes: number;
  manga_publishing_status: number;
  manga_id: number;
  manga_magazines: any;
  manga_total_members: number;
  manga_total_scores: number;
  manga_score_val: number;
  manga_score_diff: number;
  manga_popularity: number;
  genres: IGenre[];
  demographics: IDemographic[];
  title_localized: any;
  manga_url: string;
  manga_image_path: string;
  is_added_to_list: boolean;
  manga_media_type_string: string;
  start_date_string?: string;
  finish_date_string?: string;
  manga_start_date_string: string;
  manga_end_date_string?: string;
  days_string?: number;
  retail_string?: number;
  priority_string: string;
  notes: string;
  editable_notes: string;
}

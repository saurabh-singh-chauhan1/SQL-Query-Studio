CREATE TABLE artists (
  artist_id INTEGER PRIMARY KEY,
  name TEXT NOT NULL
);

CREATE TABLE albums (
  album_id INTEGER PRIMARY KEY,
  title TEXT NOT NULL,
  artist_id INTEGER NOT NULL,
  FOREIGN KEY (artist_id) REFERENCES artists(artist_id)
);

CREATE TABLE tracks (
  track_id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  album_id INTEGER NOT NULL,
  milliseconds INTEGER,
  FOREIGN KEY (album_id) REFERENCES albums(album_id)
);

INSERT INTO artists VALUES (1, 'AC/DC'), (2, 'Aerosmith');
INSERT INTO albums VALUES (1, 'For Those About To Rock', 1), (2, 'Big Ones', 2);
INSERT INTO tracks VALUES
  (1, 'Angus Speaks', 1, 210000),
  (2, 'Rock and Roll Ain''t Noise Pollution', 1, 250000),
  (3, 'Dude (Looks Like a Lady)', 2, 264000);

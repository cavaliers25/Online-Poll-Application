--
-- PostgreSQL database dump
--

-- Dumped from database version 12.3
-- Dumped by pg_dump version 12.3

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: genres; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.category (
    id integer NOT NULL,
    category_name character varying
);


--
-- Name: genres_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.category_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: genres_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.category_id_seq OWNED BY public.category.id;


--
-- Name: movies; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.poll (
    id character varying NOT NULL,
    ques character varying

);

CREATE TABLE public.polloptions (
    id character varying NOT NULL,
    name character varying,
    ogpollid character varying NOT NULL,
    votes integer,
    count integer,
    votedby character varying[]
);

ALTER TABLE public.polloptions
  ALTER COLUMN votedby SET DEFAULT array[]::varchar[];

CREATE TABLE public.user (
    id character varying NOT NULL,
    name character varying,
    email character varying,
    password character varying
);


--
-- Name: movies_genres; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.poll_category (
    id integer NOT NULL,
    poll_id character varying,
    category_id integer

);

--
-- Name: movies_genres_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.poll_category_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.poll_category_id_seq OWNED BY public.poll_category.id;


CREATE TABLE public.poll_polloptions (
    id character varying NOT NULL,
    poll_id character varying,
    polloptions_id character varying

);

-- CREATE SEQUENCE public.poll_polloptions_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;

--
-- Name: movies_genres_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

-- ALTER SEQUENCE public.poll_polloptions_id_seq OWNED BY public.poll_polloptions.id;


--
-- Name: movies_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

-- CREATE SEQUENCE public.poll_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;
--
--
-- ALTER SEQUENCE public.poll_id_seq OWNED BY public.poll.id;


-- CREATE SEQUENCE public.polloptions_id_seq
--     AS integer
--     START WITH 1
--     INCREMENT BY 1
--     NO MINVALUE
--     NO MAXVALUE
--     CACHE 1;


--
-- Name: movies_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--
--
-- ALTER SEQUENCE public.poll_id_seq OWNED BY public.polloptions.id;


--
-- Name: genres id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.category ALTER COLUMN id SET DEFAULT nextval('public.category_id_seq'::regclass);


--
-- Name: movies id; Type: DEFAULT; Schema: public; Owner: -
--

-- ALTER TABLE ONLY public.poll ALTER COLUMN id SET DEFAULT nextval('public.poll_id_seq'::regclass);
--
-- ALTER TABLE ONLY public.polloptions ALTER COLUMN id SET DEFAULT nextval('public.polloptions_id_seq'::regclass);


--
-- Name: movies_genres id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.poll_category ALTER COLUMN id SET DEFAULT nextval('public.poll_category_id_seq'::regclass);


-- ALTER TABLE ONLY public.poll_polloptions ALTER COLUMN id SET DEFAULT nextval('public.poll_polloptions_id_seq'::regclass);


--
-- Data for Name: genres; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.category (id, category_name) FROM stdin;
1	Education
2	Sports
3	Movies
\.

COPY public.user (id, name, email, password) FROM stdin;
1	Akash Singh Chauhan	akash@user.com	abc
\.


--
-- Data for Name: movies; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.poll (id, ques) FROM stdin;
1	Where do you get your news?
2	Which is your favourite sport?
3	Which is your favourite movie?
\.

COPY public.polloptions (id, name, ogpollid, votes, count) FROM stdin;
1	Internet	1	0	0
2	Television	1	0	0
3	Radio	1	0	0
4	Newspaper	1	0	0
5	Cricket	2	0	0
6	Football	2	0	0
7	Tennis	2	0	0
8	Basketball	2	0	0
9	The Dark Knight	3	0	0
10	Shawshank Redemption	3	0	0
11	Godfather	3	0	0
12	Inception	3	0	0
\.


--
-- Data for Name: movies_genres; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.poll_category (id, poll_id, category_id) FROM stdin;
1	1	1
2	2	2
3	3	3
\.

COPY public.poll_polloptions (id, poll_id, polloptions_id) FROM stdin;
1	1	1
2	1	2
3	1	3
4	1	4
5	2	5
6	2	6
7	2	7
8	2	8
9	3	9
10	3	10
11	3	11
12	3	12
\.


--
-- Name: genres_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.category_id_seq', 3, true);


--
-- Name: movies_genres_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.poll_category_id_seq', 1, false);

-- SELECT pg_catalog.setval('public.poll_polloptions_id_seq', 1, false);


--
-- Name: movies_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

-- SELECT pg_catalog.setval('public.poll_id_seq', 3, true);
--
-- SELECT pg_catalog.setval('public.polloptions_id_seq', 12, true);


--
-- Name: genres genres_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.category
    ADD CONSTRAINT category_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.user
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);


--
-- Name: movies_genres movies_genres_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

-- ALTER TABLE ONLY public.poll_category
--     ADD CONSTRAINT poll_category_pkey PRIMARY KEY (id);


--
-- Name: movies movies_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.poll
    ADD CONSTRAINT poll_pkey PRIMARY KEY (id);


ALTER TABLE ONLY public.polloptions
    ADD CONSTRAINT polloptions_pkey PRIMARY KEY (id);

ALTER TABLE ONLY public.poll_polloptions
    ADD CONSTRAINT poll_polloptions_pkey PRIMARY KEY (id);


--
-- Name: movies_genres fk_movie_genries_genre_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

-- ALTER TABLE ONLY public.poll_category
--     ADD CONSTRAINT fk_poll_categories_category_id FOREIGN KEY (category_id) REFERENCES public.category(id);
-- --

--
-- Name: movies_genres fk_movie_genries_movie_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--
--
-- ALTER TABLE ONLY public.poll_category
--     ADD CONSTRAINT fk_poll_categories_poll_id FOREIGN KEY (poll_id) REFERENCES public.poll(id);
-- --
-- --
-- --
-- ALTER TABLE ONLY public.poll_polloptions
--     ADD CONSTRAINT fk_poll_poll_polloptions_poll_id FOREIGN KEY (poll_id) REFERENCES public.poll(id);
--
--
-- ALTER TABLE ONLY public.poll_polloptions
--     ADD CONSTRAINT fk_poll_poll_polloptions_polloptions_id FOREIGN KEY (polloptions_id) REFERENCES public.polloptions(id);
--

--
-- PostgreSQL database dump complete
--

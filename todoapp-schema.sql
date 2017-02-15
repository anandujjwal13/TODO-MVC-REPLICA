--
-- PostgreSQL database dump
--

-- Dumped from database version 9.6.1
-- Dumped by pg_dump version 9.6.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: tasks; Type: TABLE; Schema: public; Owner: anandujjwal
--

CREATE TABLE tasks (
    id integer NOT NULL,
    description text NOT NULL,
    status boolean NOT NULL
);


ALTER TABLE tasks OWNER TO anandujjwal;

--
-- Name: tasks_id_seq; Type: SEQUENCE; Schema: public; Owner: anandujjwal
--

CREATE SEQUENCE tasks_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE tasks_id_seq OWNER TO anandujjwal;

--
-- Name: tasks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: anandujjwal
--

ALTER SEQUENCE tasks_id_seq OWNED BY tasks.id;


--
-- Name: tasks id; Type: DEFAULT; Schema: public; Owner: anandujjwal
--

ALTER TABLE ONLY tasks ALTER COLUMN id SET DEFAULT nextval('tasks_id_seq'::regclass);


--
-- Data for Name: tasks; Type: TABLE DATA; Schema: public; Owner: anandujjwal
--

COPY tasks (id, description, status) FROM stdin;
239	nothing should be private	f
240	class encapsulation	f
241	promisify everything	f
242	run tests on promises	f
243	dynamic add event listeners	f
244	responsive css	f
245	front end testing	f
246	migration	f
\.


--
-- Name: tasks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: anandujjwal
--

SELECT pg_catalog.setval('tasks_id_seq', 246, true);


--
-- Name: tasks tasks_pkey; Type: CONSTRAINT; Schema: public; Owner: anandujjwal
--

ALTER TABLE ONLY tasks
    ADD CONSTRAINT tasks_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--


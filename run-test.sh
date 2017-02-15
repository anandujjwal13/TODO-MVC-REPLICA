dropdb -U anandujjwal todoapp-tests
createdb -U anandujjwal todoapp-tests
psql -U anandujjwal -d todoapp-tests -f todoapp-schema.sql
dropdb -U anandujjwal todoapp-tests
createdb -U anandujjwal todoapp-tests
psql -U anandujjwal -d todoapp-tests -f todoapp-schema.sql



sh run-test.sh && mode='test' node api.js


pg_dump -U anandujjwal todoapp -f todoapp-schema.sql
createdb todoapp-tests
psql -U anandujjwal -d todoapp-tests -f todoapp-schema.sql
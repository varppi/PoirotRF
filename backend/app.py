import database
from flask_init import APP
import handlers
from data import cache

handlers = handlers.Handlers()
handlers.HANDLERS_INIT()
database.init_db()

APP.run("127.0.0.1", 8083)
from fasthtml.common import *

app,rt = fast_app(live=True)

@rt('/')
def get(req): return Div(P('Hello World!'), hx_get="/change")

@rt('/change')
def get(): return P('Nice to be here!')

serve()

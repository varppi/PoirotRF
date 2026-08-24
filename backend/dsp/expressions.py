import numpy as np
import sympy as sp
import numexpr as ne

def RUN_EXPRESSION(expression,signal):
    return ne.evaluate(
        expression, 
        local_dict={
            "x": signal, 
            "pi":np.pi,
            "e": np.e,
        })

import pandas as pd

df = pd.read_csv('espacios-culturales-limpio.csv')


categorias_unicas = df['FUNCION_PRINCIPAL'].drop_duplicates().sort_values().reset_index(drop=True)
df_categorias = pd.DataFrame({
    'id_categoria': range(1, len(categorias_unicas) + 1),
    'nombre': categorias_unicas
})
df_categorias.to_csv('categorias.csv', index=False)

barrios_unicos = df['BARRIO'].drop_duplicates().sort_values().reset_index(drop=True)
df_barrios = pd.DataFrame({
    'id_barrio': range(1, len(barrios_unicos) + 1),
    'nombre': barrios_unicos
})
df_barrios.to_csv('barrios.csv', index=False)

df_merge = df.merge(df_categorias, left_on='FUNCION_PRINCIPAL', right_on='nombre', how='left')
df_merge = df_merge.merge(df_barrios, left_on='BARRIO', right_on='nombre', how='left')

df_espacios = df_merge[[
    'fid',
    'ESTABLECIMIENTO',
    'LATITUD',
    'LONGITUD',
    'id_categoria',
    'id_barrio',
]].rename(columns={
    'fid': 'id_espacio',
    'ESTABLECIMIENTO': 'nombre',
})
df_espacios.to_csv('espacios_culturales.csv', index=False)
























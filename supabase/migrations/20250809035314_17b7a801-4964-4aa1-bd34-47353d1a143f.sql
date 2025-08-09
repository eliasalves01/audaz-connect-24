-- Habilitar replica identity para atualizações em tempo real
ALTER TABLE pedidos REPLICA IDENTITY FULL;

-- Adicionar tabela à publicação de tempo real
ALTER PUBLICATION supabase_realtime ADD TABLE pedidos;
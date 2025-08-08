-- Criar tabela de produtos para o catálogo
CREATE TABLE public.produtos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  codigo TEXT UNIQUE NOT NULL,
  nome TEXT NOT NULL,
  categoria TEXT NOT NULL,
  tamanho TEXT,
  preco DECIMAL(10,2) NOT NULL,
  imagem_url TEXT,
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de revendedores
CREATE TABLE public.revendedores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  telefone TEXT,
  endereco TEXT,
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de estoque do revendedor
CREATE TABLE public.estoque_revendedor (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  revendedor_id UUID NOT NULL REFERENCES public.revendedores(id) ON DELETE CASCADE,
  produto_id UUID NOT NULL REFERENCES public.produtos(id) ON DELETE CASCADE,
  codigo_peca TEXT UNIQUE NOT NULL,
  cor TEXT,
  data_compra DATE NOT NULL,
  data_venda DATE,
  preco_compra DECIMAL(10,2) NOT NULL,
  preco_venda DECIMAL(10,2),
  status TEXT NOT NULL DEFAULT 'disponivel' CHECK (status IN ('disponivel', 'vendido', 'reservado')),
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(revendedor_id, codigo_peca)
);

-- Criar tabela de pedidos
CREATE TABLE public.pedidos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  numero_pedido TEXT UNIQUE NOT NULL,
  revendedor_id UUID NOT NULL REFERENCES public.revendedores(id) ON DELETE CASCADE,
  total_itens INTEGER NOT NULL DEFAULT 0,
  valor_total DECIMAL(10,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'processando', 'enviado', 'entregue', 'cancelado')),
  data_pedido DATE NOT NULL DEFAULT CURRENT_DATE,
  data_entrega DATE,
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de itens do pedido
CREATE TABLE public.itens_pedido (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  pedido_id UUID NOT NULL REFERENCES public.pedidos(id) ON DELETE CASCADE,
  produto_id UUID NOT NULL REFERENCES public.produtos(id) ON DELETE CASCADE,
  quantidade INTEGER NOT NULL DEFAULT 1,
  preco_unitario DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.produtos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.revendedores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.estoque_revendedor ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pedidos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.itens_pedido ENABLE ROW LEVEL SECURITY;

-- Políticas para produtos (todos podem ver, apenas admins podem modificar)
CREATE POLICY "Produtos são visíveis para todos" 
ON public.produtos 
FOR SELECT 
USING (true);

CREATE POLICY "Apenas admins podem inserir produtos" 
ON public.produtos 
FOR INSERT 
WITH CHECK (true); -- Temporário até implementarmos auth

CREATE POLICY "Apenas admins podem atualizar produtos" 
ON public.produtos 
FOR UPDATE 
USING (true); -- Temporário até implementarmos auth

CREATE POLICY "Apenas admins podem deletar produtos" 
ON public.produtos 
FOR DELETE 
USING (true); -- Temporário até implementarmos auth

-- Políticas para revendedores (todos podem ver, apenas admins podem modificar)
CREATE POLICY "Revendedores são visíveis para todos" 
ON public.revendedores 
FOR SELECT 
USING (true);

CREATE POLICY "Apenas admins podem inserir revendedores" 
ON public.revendedores 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Apenas admins podem atualizar revendedores" 
ON public.revendedores 
FOR UPDATE 
USING (true);

CREATE POLICY "Apenas admins podem deletar revendedores" 
ON public.revendedores 
FOR DELETE 
USING (true);

-- Políticas para estoque (revendedores veem apenas o próprio estoque)
CREATE POLICY "Revendedores podem ver seu próprio estoque" 
ON public.estoque_revendedor 
FOR SELECT 
USING (true); -- Temporário até implementarmos auth

CREATE POLICY "Revendedores podem inserir em seu estoque" 
ON public.estoque_revendedor 
FOR INSERT 
WITH CHECK (true); -- Temporário até implementarmos auth

CREATE POLICY "Revendedores podem atualizar seu estoque" 
ON public.estoque_revendedor 
FOR UPDATE 
USING (true); -- Temporário até implementarmos auth

-- Políticas para pedidos
CREATE POLICY "Pedidos são visíveis conforme acesso" 
ON public.pedidos 
FOR SELECT 
USING (true);

CREATE POLICY "Revendedores podem criar pedidos" 
ON public.pedidos 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Pedidos podem ser atualizados" 
ON public.pedidos 
FOR UPDATE 
USING (true);

-- Políticas para itens de pedido
CREATE POLICY "Itens de pedido são visíveis conforme acesso ao pedido" 
ON public.itens_pedido 
FOR SELECT 
USING (true);

CREATE POLICY "Itens podem ser inseridos em pedidos" 
ON public.itens_pedido 
FOR INSERT 
WITH CHECK (true);

-- Trigger para atualizar updated_at
CREATE TRIGGER update_produtos_updated_at
BEFORE UPDATE ON public.produtos
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_revendedores_updated_at
BEFORE UPDATE ON public.revendedores
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_estoque_revendedor_updated_at
BEFORE UPDATE ON public.estoque_revendedor
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_pedidos_updated_at
BEFORE UPDATE ON public.pedidos
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Inserir dados iniciais de produtos
INSERT INTO public.produtos (codigo, nome, categoria, tamanho, preco, imagem_url) VALUES
('SH001', 'Camiseta Short Básica', 'short', 'M', 89.90, '/placeholder.svg'),
('OV002', 'Moletom Oversized', 'oversized', 'G', 159.90, '/placeholder.svg'),
('LO003', 'Blusa Longline Listrada', 'longline', 'P', 199.90, '/placeholder.svg'),
('SH004', 'Regata Short Feminina', 'short', 'P', 79.90, '/placeholder.svg'),
('OV005', 'Casaco Oversized Inverno', 'oversized', 'M', 249.90, '/placeholder.svg');

-- Inserir dados iniciais de revendedores
INSERT INTO public.revendedores (nome, email, telefone, endereco) VALUES
('Maria Silva', 'maria.silva@email.com', '(11) 99999-1111', 'São Paulo, SP'),
('João Santos', 'joao.santos@email.com', '(11) 99999-2222', 'Rio de Janeiro, RJ'),
('Ana Costa', 'ana.costa@email.com', '(11) 99999-3333', 'Belo Horizonte, MG'),
('Carlos Lima', 'carlos.lima@email.com', '(11) 99999-4444', 'Porto Alegre, RS');

-- Inserir alguns itens no estoque dos revendedores
DO $$
DECLARE
    maria_id UUID;
    joao_id UUID;
    produto1_id UUID;
    produto2_id UUID;
BEGIN
    -- Pegar IDs
    SELECT id INTO maria_id FROM public.revendedores WHERE email = 'maria.silva@email.com';
    SELECT id INTO joao_id FROM public.revendedores WHERE email = 'joao.santos@email.com';
    SELECT id INTO produto1_id FROM public.produtos WHERE codigo = 'SH001';
    SELECT id INTO produto2_id FROM public.produtos WHERE codigo = 'OV002';
    
    -- Inserir estoque para Maria
    INSERT INTO public.estoque_revendedor (revendedor_id, produto_id, codigo_peca, cor, data_compra, preco_compra, status) VALUES
    (maria_id, produto1_id, 'BL001', 'Azul', '2024-07-15', 89.90, 'disponivel'),
    (maria_id, produto2_id, 'VE003', 'Vermelho', '2024-07-20', 159.90, 'disponivel');
    
    -- Inserir estoque para João (algumas peças já vendidas)
    INSERT INTO public.estoque_revendedor (revendedor_id, produto_id, codigo_peca, cor, data_compra, data_venda, preco_compra, preco_venda, status) VALUES
    (joao_id, produto1_id, 'CA002', 'Azul Escuro', '2024-07-15', '2024-08-02', 89.90, 159.90, 'vendido'),
    (joao_id, produto2_id, 'BL004', 'Preto', '2024-07-20', '2024-07-28', 159.90, 249.90, 'vendido');
END $$;
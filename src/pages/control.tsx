import Layout from '@/components/layout'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { api } from '@/utils/api'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { toast } from 'react-hot-toast'
import Select from 'react-select'

type promptKey = {
  [key: string]: string
}

const Control = () => {
  const [prompt, setPrompt] = useState('')
  const [selectedPrompt, setSelectedPrompt] = useState('')
  const [disabled, setDisabled] = useState(false)
  const [prompts] = useState<promptKey>({
    escritorio:
      'Professional headshot of KEYPERSON. Picture should focus on a crisp and clear face with symmetrical eyes, fully visible and without distractions. The lighting should be dramatic yet flattering, highlighting the confidence and professionalism typically seen in LinkedIn profile pictures. The image should be in high resolution and color.',
    gravida:
      'Emotional and detailed portrait of KEYPERSON, capturing the beauty and joy of motherhood. Fully visible face, symmetrical eyes, vibrant and colored image. A powerful and dramatic light enhances the image, giving it a sharp and smooth focus.',
    fantasia:
      'Creative portrait of KEYPERSON, highlighting magic and imagination. Detailed and fully visible face, symmetrical eyes, and colored image. Dramatic and powerful lighting brings the fantasy theme to life with sharp and smooth focus.',
    viagem:
      'Vibrant portrait of KEYPERSON amid the adventure of travel. Detailed face, symmetrical eyes, and colored image capturing the spirit of the traveler. Powerful and dramatic lighting, giving a sharp and smooth focus to the image.',
    vida: 'Attractive portrait of KEYPERSON, capturing the dynamic and energetic lifestyle. Detailed face, symmetrical eyes, and colored image. Powerful and dramatic lighting that gives a sharp and smooth focus to the image.',
  })

  const trainModel = api.user.trainModel.useMutation({
    onError: (error) => {
      console.log(error)
      toast.error(error.message)
    },
    onSuccess: () => {
      toast.success('Modelo enviado para treino com sucesso!')
    },
  })
  const modelTrained = api.user.getModelTrained.useQuery()

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setDisabled(true)
    void trainModel.mutate({ prompt: selectedPrompt || prompt })
  }

  const router = useRouter()

  if (modelTrained.data?.modelDoneTraining) void router.push('/dashboard')

  return (
    <Layout>
      <form
        className="flex flex-col w-full h-full gap-4 items-center text-center md:text-left p-4 border-x border-b border-slate-800 overflow-y-auto"
        onSubmit={handleSubmit}
      >
        <section className="grid gap-1.5 max-w-xl w-full">
          <Label htmlFor="prompt">Digite seu prompt:</Label>
          <Textarea
            className="w-full p-2 bg-transparent border-2 border-slate-800 rounded"
            placeholder="Digite aqui o seu prompt ou selecione um abaixo."
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            disabled={!!selectedPrompt}
          />
          <p className="text-xs text-muted-foreground">
            A AI entende português, mas os melhores resultados são obtidos em inglês.
          </p>
          <p className="text-xs text-red-400">
            COLOQUE KEYPERSON PARA SE REFERIR A VC (OLHE OS EXEMPLOS)
          </p>
        </section>
        <hr className="w-full border-slate-800" />
        <section className="grid gap-1.5 max-w-xl w-full">
          <Label htmlFor="prompts">Caso prefira, escolha um prompt pronto</Label>
          <Select
            options={[
              { value: '', label: 'Quero escrever meu próprio prompt' },
              { value: 'escritorio', label: 'Escritório' },
              { value: 'gravida', label: 'Grávida' },
              { value: 'fantasia', label: 'Fantasia' },
              { value: 'viagem', label: 'Viagem' },
              { value: 'vida', label: 'Estilo de Vida' },
            ]}
            onChange={(e) => {
              setSelectedPrompt(prompts[e?.value as string] ?? '')
              setPrompt('')
            }}
            theme={(theme) => ({
              ...theme,
              borderRadius: 0,
              colors: {
                ...theme.colors,
                primary25: 'gray',
                primary: 'black',
              },
            })}
            styles={{
              option: (provided, state) => ({
                ...provided,
                color: state.isSelected ? 'white' : 'black',
              }),
              singleValue: (provided, state) => {
                const opacity = state.isDisabled ? 0.5 : 1
                const transition = 'opacity 300ms'

                return { ...provided, opacity, transition, color: 'black' }
              },
            }}
          />
          <Textarea placeholder="Nenhum prompt selecionado" value={selectedPrompt} disabled />
        </section>
        <hr className="w-full border-slate-800" />
        {!modelTrained.data?.modelTrained ? (
          <Button
            type="submit"
            className="w-full max-w-xl border rounded hover:bg-gray-800 transition duration-100"
            disabled={trainModel.isLoading || disabled}
          >
            Treinar modelo e gerar imagens
          </Button>
        ) : (
          <div className="flex flex-col justify-center items-center mt-8">
            <span>Modelo esta sendo treinado, agora é so aguardar o e-mail!</span>
            <span className="text-xs">
              Pode aguardar nessa pagina tb, atualziaremos quando as fotos estiverem prontas!
            </span>
          </div>
        )}
      </form>
    </Layout>
  )
}

export default Control

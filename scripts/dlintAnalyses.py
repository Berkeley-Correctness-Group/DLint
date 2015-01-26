def get(prefix):
  filename = 'src/js/analyses/dlint/analyses.txt'
  return [prefix+line.strip() for line in open(filename)]

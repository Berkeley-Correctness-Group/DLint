import sys
sys.path.append('../jalangi/scripts/')
import sj
import dlintAnalyses

def run():
  chained = ' --analysis ../../jalangi/src/js/analyses2/ChainedAnalyses2.js'
  analysesStr = chained+' --analysis '+(' --analysis '.join(dlintAnalyses.get('../src/js/analyses/dlint/')))
  sj.create_and_cd_jalangi_tmp()
  sj.execute(sj.INSTRUMENTATION_SCRIPT+' ../'+sys.argv[1]+'.js')
  sj.execute(sj.ANALYSIS2_SCRIPT+analysesStr+' ../'+sys.argv[1]+'_jalangi_.js')
  sj.cd_parent()

run()

